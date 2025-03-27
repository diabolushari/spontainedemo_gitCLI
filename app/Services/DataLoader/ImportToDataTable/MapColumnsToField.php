<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\DataTable\DataTableText;

class MapColumnsToField
{
    /**
     * @param  string[]  $excelFieldNames
     * @param  array{
     *     field_id: int,
     *     field_name: string,
     *     data_table_column: string|null
     * }[]|null  $fieldMapping
     * @return TableColumnInfo[]
     */
    public function map(array $excelFieldNames, int $dataDetailId, ?array $fieldMapping = null): array
    {

        /**
         * @var TableColumnInfo[] $fieldInfo
         */
        $fieldInfo = [];

        DataTableDate::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDate $tableField) use (&$fieldInfo, $excelFieldNames, $fieldMapping) {
                if ($fieldMapping != null) {
                    foreach ($fieldMapping as $field) {
                        if ($field['data_table_column'] === $tableField->column) {
                            $this->isFieldMapped(
                                $fieldInfo,
                                $field,
                                false,
                                null
                            );
                        }
                    }

                    return;
                }
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null,
                        $fieldMapping
                    );
                }
            });

        DataTableDimension::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDimension $tableField) use (&$fieldInfo, $excelFieldNames, $fieldMapping) {
                if ($fieldMapping != null) {
                    foreach ($fieldMapping as $field) {
                        if ($field['data_table_column'] === $tableField->column) {
                            $this->isFieldMapped(
                                $fieldInfo,
                                $field,
                                true,
                                $tableField->meta_structure_id
                            );
                        }
                    }

                    return;
                }
                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        true,
                        $tableField->meta_structure_id,
                        $fieldMapping
                    );
                }
            });

        DataTableMeasure::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableMeasure $tableField) use (&$fieldInfo, $excelFieldNames, $fieldMapping) {

                if ($fieldMapping != null) {
                    foreach ($fieldMapping as $field) {
                        if ($field['data_table_column'] === $tableField->column) {
                            $this->isFieldMapped(
                                $fieldInfo,
                                $field,
                                false,
                                null
                            );
                        }
                    }

                    return;
                }

                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null,
                        $fieldMapping
                    );
                    if ($tableField->unit_column != null && $tableField->unit_field_name != null) {
                        $this->insertToList(
                            $fieldInfo,
                            $tableField->unit_field_name,
                            $excelFieldName,
                            $tableField->unit_column,
                            false,
                            null,
                            $fieldMapping
                        );
                    }
                }
            });

        DataTableText::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableText $tableField) use (&$fieldInfo, $excelFieldNames, $fieldMapping) {

                if ($fieldMapping != null) {
                    foreach ($fieldMapping as $field) {
                        if ($field['data_table_column'] === $tableField->column) {
                            $this->isFieldMapped(
                                $fieldInfo,
                                $field,
                                false,
                                null
                            );
                        }
                    }

                    return;
                }

                foreach ($excelFieldNames as $excelFieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $excelFieldName,
                        $tableField->column,
                        false,
                        null,
                        $fieldMapping
                    );
                }
            });

        return $fieldInfo;

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
