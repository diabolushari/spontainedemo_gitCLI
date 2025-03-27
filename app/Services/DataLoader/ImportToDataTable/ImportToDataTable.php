<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableRelation;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ImportToDataTable
{
    use DeleteDuplicateEntriesForField;

    public function __construct(
        private MapColumnsToField $mapColumnsToField,
        private ConvertToDataTable $convertToDataTable,
        private SyncColumnMetaData $syncColumnMetaData,
        private InsertItemToDataTable $insertItemToDataTable,
        private MapColumnToRelation $mapColumnToRelation
    ) {
        //
    }

    /**
     * Import data to the data table
     *
     * @param  array[]  $data
     * @param  array{
     *     field_id: int,
     *     field_name: string,
     *     field_type: string,
     *     data_table_column: string|null
     * }[]|null  $fieldMapping
     * @return array{
     *     is_successful: bool,
     *     total_records: int,
     *     error_message: string|null,
     *     executed_at: Carbon,
     *     completed_at: Carbon|null
     *
     * @throws Exception
     */
    public function importToDataTable(
        DataDetail $dataDetail,
        array $data,
        bool $deleteExistingData = false,
        ?string $duplicationIdentifierField = null,
        ?array $fieldMapping = null
    ): array {

        $status = [
            'is_successful' => false,
            'total_records' => 0,
            'error_message' => null,
            'executed_at' => now(),
            'completed_at' => null,
        ];

        // Import data to the data table
        if (empty($data)) {
            $status['error_message'] = 'No data to import';
            $status['completed_at'] = now();

            return $status;
        }

        $referredRelations = DataTableRelation::where('related_table_id', $dataDetail->id)
            ->whereHas('dataTable')
            ->get();

        $relationColumnInfo = $this->mapColumnToRelation->map($fieldMapping, $referredRelations);

        $dataColumns = array_keys($data[0]);

        $fieldInfo = $this->mapColumnsToField->map($dataColumns, $dataDetail->id, $fieldMapping);

        //map fieldInfo/data into data table
        $dataTable = $this->convertToDataTable->convert(
            $fieldInfo,
            $relationColumnInfo,
            $data,
            $dataDetail->id
        );

        //insert new MetaData found in data to MetaData table and fetch id's of all present metadata
        /** @var array<string, array<string, int>> $metaDataIds */
        $metaDataIds = [];

        try {
            foreach ($fieldInfo as $field) {
                if ($field->metaStructureId != null) {
                    $metaDataIds[$field->column] = $this->syncColumnMetaData->sync(
                        $field->metaStructureId,
                        array_column($dataTable, $field->column)
                    );
                }
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        //replace string values for dimensions with meta_data_id
        foreach ($dataTable as &$record) {
            foreach ($fieldInfo as $field) {
                if ($field->isMetaData) {
                    $newValue = null;
                    if ($record[$field->column] !== null && $record[$field->column] !== '') {
                        $newValue = $metaDataIds[$field->column][strtolower($record[$field->column])] ?? null;
                    }
                    $record[$field->column] = $newValue;
                }
            }
        }

        try {
            if ($deleteExistingData && $duplicationIdentifierField == null) {
                DB::table($dataDetail->table_name)->truncate();
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        try {
            if ($deleteExistingData && $duplicationIdentifierField != null) {
                $this->deleteDuplicateEntries(
                    $dataDetail,
                    $duplicationIdentifierField,
                    $data
                );
            }

            // Use different insertion methods based on whether there are related tables
            if (count($relationColumnInfo) === 0) {
                $this->performMassInsertion($dataDetail, $dataTable);
            } else {
                $this->performSingleRecordInsertion($dataDetail, $dataTable, $relationColumnInfo);
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        $status['is_successful'] = true;
        $status['total_records'] = count($data);
        $status['completed_at'] = now();

        return $status;
    }

    /**
     * Perform mass insertion of records in chunks
     */
    private function performMassInsertion(DataDetail $dataDetail, array $dataTable): void
    {
        foreach (array_chunk($dataTable, 1000) as $chunk) {
            DB::table($dataDetail->table_name)->insert($chunk);
        }
    }

    /**
     * Perform single record insertion for tables with relations
     *
     * @param  array<array<array-key, string|int|null|float|array>>  $dataTable
     * @param  RelationColumnInfo[]  $relationColumnInfo
     */
    private function performSingleRecordInsertion(DataDetail $dataDetail, array $dataTable, array $relationColumnInfo): void
    {
        /** @var array<string, array> */
        $relations = [];

        foreach ($relationColumnInfo as $relationInfo) {
            $relations[$relationInfo->fieldMapping->fieldName] = [];
        }

        foreach ($dataTable as $record) {
            $dataWithoutRelations = [
                ...$record,
            ];
            foreach ($relationColumnInfo as $relationInfo) {
                unset($dataWithoutRelations[$relationInfo->fieldMapping->fieldName]);
            }
            $recordId = DB::table($dataDetail->table_name)->insertGetId($dataWithoutRelations);
            foreach ($relationColumnInfo as $relationInfo) {
                if (isset($record[$relationInfo->fieldMapping->fieldName])) {
                    $data = $record[$relationInfo->fieldMapping->fieldName];
                    if ($relationInfo->fieldMapping->fieldType === 'object') {
                        $data = [$data];
                    }

                    foreach ($data as &$item) {
                        $item[$relationInfo->relation->column] = $recordId;
                    }

                    $relations[$relationInfo->fieldMapping->fieldName] = [
                        ...$relations[$relationInfo->fieldMapping->fieldName],
                        ...$data,
                    ];
                }
            }
        }

        foreach ($relationColumnInfo as $relationInfo) {
            $dataDetail = DataDetail::find($relationInfo->relation->data_detail_id);
            if ($dataDetail != null) {
                $this->importToDataTable(
                    $dataDetail,
                    $relations[$relationInfo->fieldMapping->fieldName],
                    false
                );
            }
        }

    }
}
