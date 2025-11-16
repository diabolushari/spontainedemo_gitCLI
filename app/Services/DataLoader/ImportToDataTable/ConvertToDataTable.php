<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;

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
        $measureColumns = $this->getMeasureColumns($dataDetailId);

        foreach ($data as $row) {
            $record = [
                'created_at' => $time,
                'updated_at' => $time,
            ];

            foreach ($fieldInfo as $field) {
                $record[$field->column] = $row[$field->fieldName] ?? null;
                $value = $row[$field->fieldName] ?? null;

                if (in_array($field->column, $measureColumns)) {
                    $value = $this->validateMeasureValue($value);
                }
                $record[$field->column] = $value;

            }

            $records[] = $record;
        }

        return $records;
    }

    private function getMeasureColumns(int $dataDetailId): array
    {
        $dataDetail = DataDetail::find($dataDetailId);

        if (! $dataDetail) {
            return [];
        }

        return $dataDetail->measureFields()->pluck('column')->toArray();
    }

    private function validateMeasureValue($value): float|int|null
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return is_float($value) ? (float) $value : (int) $value;
        }

        return 0;
    }
}
