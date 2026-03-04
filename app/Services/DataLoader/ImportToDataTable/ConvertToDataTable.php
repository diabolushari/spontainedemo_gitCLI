<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Support\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date;

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
                $value = $row[$field->fieldName] ?? null;

                if ($field->type === 'measure') {
                    $value = $this->validateMeasureValue($value);
                } elseif (in_array($field->type, ['date', 'datetime'])) {
                    $value = $this->normalizeDateValue($value);
                }

                $record[$field->column] = $value;
            }

            $records[] = $record;
        }

        return $records;
    }

    private function normalizeDateValue($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(Date::excelToDateTimeObject($value))->toDateTimeString();
            }

            return Carbon::parse($value)->toDateTimeString();
        } catch (\Exception $e) {
            return null;
        }
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
