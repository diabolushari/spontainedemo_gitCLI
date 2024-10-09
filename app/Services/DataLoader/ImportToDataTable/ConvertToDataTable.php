<?php

namespace App\Services\DataLoader\ImportToDataTable;

readonly class ConvertToDataTable
{
    /**
     * @param  TableColumnInfo[]  $fieldInfo
     * @param  array[]  $data
     * @return array<array<array-key, string|int|null|float>>
     */
    public function convert(
        array $fieldInfo,
        array $data,
        int $dataDetailId
    ): array {
        $records = [];

        $time = now()->toDateTimeString();

        foreach ($data as $row) {
            $record = [
                'created_at' => $time,
                'updated_at' => $time,
            ];

            foreach ($fieldInfo as $field) {
                $record[$field->column] = $row[$field->fieldName] ?? null;
            }

            $records[] = $record;
        }

        return $records;
    }
}
