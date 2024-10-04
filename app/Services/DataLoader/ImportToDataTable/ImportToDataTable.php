<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use App\Models\SubjectArea\SubjectArea;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

readonly class ImportToDataTable
{
    public function __construct(
        private MapColumnsToField $mapColumnsToField,
        private ConvertToDataTable $convertToDataTable,
        private SyncColumnMetaData $syncColumnMetaData
    ) {
        //
    }

    /**
     * Import data to the data table
     *
     * @param  array[]  $data
     * @return array{
     *     is_successful: bool,
     *     total_records: int,
     *     error_message: string|null,
     *     executed_at: Carbon,
     *     completed_at: Carbon|null
     * }
     *
     * @throws Exception
     */
    public function importToDataTable(DataDetail $dataDetail, array $data): array
    {

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

        //cancel import if data table already has data
        $count = DB::table($dataDetail->subjectArea->table_name)
            ->where('data_detail_id', $dataDetail->id)
            ->count();

        if ($count > 0) {
            $status['error_message'] = 'Data table already has data';
            $status['completed_at'] = now();

            return $status;
        }

        $dataColumns = array_keys($data[0]);

        $fieldInfo = $this->mapColumnsToField->map($dataColumns, $dataDetail->id);

        //map fieldInfo/data into data table
        $dataTable = $this->convertToDataTable->convert($fieldInfo, $data, $dataDetail->id);

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
                    $newValue = $metaDataIds[$field->column][strtolower($record[$field->column])] ?? null;
                    $record[$field->column] = $newValue;
                }
            }
        }

        //save data
        $subjectArea = SubjectArea::where('id', $dataDetail->subject_area_id)->first();
        if ($subjectArea == null) {
            $status['error_message'] = 'Subject Area not found';
            $status['completed_at'] = now();

            return $status;
        }

        try {
            foreach (array_chunk($dataTable, 1000) as $chunk) {
                DB::table($subjectArea->table_name)->insert($chunk);
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        $status['is_successful'] = true;
        $status['total_records'] = count($dataTable);
        $status['completed_at'] = now();

        return $status;
    }
}
