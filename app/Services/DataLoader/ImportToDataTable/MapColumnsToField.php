<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;

class MapColumnsToField
{
    /**
     * @param  array<string>  $excelFieldNames
     * @return TableColumnInfo[]
     */
    public function map(array $excelFieldNames, int $dataDetailId): array
    {

        /**
         * @var TableColumnInfo[] $fieldInfo
         */
        $fieldInfo = [];

        DataTableDate::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDate $tableField) use (&$fieldInfo, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null
                    );
                }
            });

        DataTableDimension::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDimension $tableField) use (&$fieldInfo, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        true,
                        $tableField->meta_structure_id
                    );
                }
            });

        DataTableMeasure::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableMeasure $tableField) use (&$fieldInfo, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null
                    );
                    if ($tableField->unit_column != null && $tableField->unit_field_name != null) {
                        $this->insertToList(
                            $fieldInfo,
                            $tableField->unit_field_name,
                            $excelFieldName,
                            $tableField->unit_column,
                            false,
                            null
                        );
                    }
                }
            });

        return $fieldInfo;

    }

    /**
     * @param  TableColumnInfo[]  $list
     */
    private function insertToList(
        array &$list,
        string $tableFieldName,
        string $excelFieldName,
        string $tableColumn,
        bool $isMetaData,
        ?int $metaStructureId
    ): void {
        $excelColumn = preg_replace('/[^a-zA-Z0-9]/', '_', $excelFieldName);

        if (
            $tableColumn === strtolower($excelColumn)
        ) {
            $list[] = new TableColumnInfo($tableColumn, $excelFieldName, $isMetaData, $metaStructureId);
        }

    }
}
