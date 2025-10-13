<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\DataTable\DataTableRelation;
use App\Models\DataTable\DataTableText;

class MapColumnsToField
{
    /**
     * @param  string[]  $excelFieldNames
     * @return TableColumnInfo[]
     */
    public function map(array $excelFieldNames, int $dataDetailId): array
    {

        /**
         * @var TableColumnInfo[] $fieldList
         */
        $fieldList = [];

        DataTableDate::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDate $tableField) use (&$fieldList, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldList,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null
                    );
                }
            });

        DataTableDimension::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDimension $tableField) use (&$fieldList, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldList,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        true,
                        $tableField->meta_structure_id,
                    );
                }
            });

        DataTableMeasure::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableMeasure $tableField) use (&$fieldList, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldList,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null,
                    );
                    if ($tableField->unit_column != null && $tableField->unit_field_name != null) {
                        $this->insertToList(
                            $fieldList,
                            $tableField->unit_field_name,
                            $excelFieldName,
                            $tableField->unit_column,
                            false,
                            null,
                        );
                    }
                }
            });

        DataTableText::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableText $tableField) use (&$fieldList, $excelFieldNames) {
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldList,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null,
                    );
                }
            });

        return $fieldList;

    }

    /**
     * @param ?array{
     *     field_id: int,
     *     field_name: string,
     *     data_table_column: string|null
     * }[]|null  $fieldMapping
     * @param  TableColumnInfo[]  $list
     */
    private function insertToList(
        array &$list,
        string $tableFieldName,
        string $excelFieldName,
        string $tableColumn,
        bool $isMetaData,
        ?int $metaStructureId,
    ): void {
        $snakeExcelColumn = preg_replace('/[^a-zA-Z0-9]/', '_', $excelFieldName);
        if (
            $tableColumn === strtolower($snakeExcelColumn)
        ) {
            $list[] = new TableColumnInfo($tableColumn, $excelFieldName, $isMetaData, $metaStructureId);
        }

    }

    private function isFieldMapped(array &$list, array $fieldMapping, bool $isMetaData, ?int $metaStructureId): void
    {
        if (isset($fieldMapping['data_table_column'])) {
            $list[] = new TableColumnInfo($fieldMapping['data_table_column'], $fieldMapping['field_name'], $isMetaData, $metaStructureId);
        }
    }
}
