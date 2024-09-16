<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;

class MapColumnsToField
{
    /**
     * @param  array<string>  $fieldNames
     * @return TableColumnInfo[]
     */
    public function map(array $fieldNames, int $dataDetailId): array
    {

        /**
         * @var TableColumnInfo[] $fieldInfo
         */
        $fieldInfo = [];

        DataTableDate::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDate $tableField) use (&$fieldInfo, $fieldNames) {
                foreach ($fieldNames as $fieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $fieldName,
                        $tableField->column,
                        false,
                        null
                    );
                }
            });

        DataTableDimension::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableDimension $tableField) use (&$fieldInfo, $fieldNames) {
                foreach ($fieldNames as $fieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $fieldName,
                        $tableField->column,
                        true,
                        $tableField->meta_structure_id
                    );
                }
            });

        DataTableMeasure::where('data_detail_id', $dataDetailId)
            ->each(function (DataTableMeasure $tableField) use (&$fieldInfo, $fieldNames) {
                foreach ($fieldNames as $fieldName) {
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->field_name,
                        $fieldName,
                        $tableField->column,
                        false,
                        null
                    );
                    $this->insertToList(
                        $fieldInfo,
                        $tableField->unit_field_name,
                        $fieldName,
                        $tableField->unit_column,
                        false,
                        null
                    );
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
        string $dataFieldName,
        string $tableColumn,
        bool $isMetaData,
        ?int $metaStructureId
    ): void {
        $formattedFieldName = implode(' ', explode('_', $dataFieldName));
        $lowerTableFieldName = strtolower($tableFieldName);

        if (
            $lowerTableFieldName == strtolower($formattedFieldName)
            || $lowerTableFieldName == strtolower($dataFieldName)
        ) {
            $list[] = new TableColumnInfo($tableColumn, $dataFieldName, $isMetaData, $metaStructureId);
        }

    }
}
