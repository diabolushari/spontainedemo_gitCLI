<?php

namespace App\Services\DataLoader\JsonStructure;

use App\Http\Requests\DataLoader\FieldMappingData;
use Carbon\Carbon;

final readonly class PerformJSONProcessing
{
    /**
     * Transform flattened JSON data by mapping JSON field paths to data table column names
     *
     * @param  array<int, array<string, string|int|float|null>>  $flattenedData
     * @param  FieldMappingData[]  $fieldMapping
     * @param  array<string, string|int|float|null>  $params
     * @return array<int, array<string, string|int|float|null>>
     */
    public function handle(array $flattenedData, array $fieldMapping, array $params): array
    {
        if (empty($fieldMapping)) {
            return [];
        }
        if (! empty($params)) {
            $this->attachParams($flattenedData, $params);
        }
        $this->convertDateFormats($flattenedData, $fieldMapping);

        return $this->mapFields($flattenedData, $fieldMapping);
    }

    private function attachParams(array &$flattenedData, array $params): void
    {

        //create a list with request_params.attached to key of each param
        $paramData = [];
        foreach ($params as $key => $value) {
            $paramData["request_params.$key"] = $value;
        }

        foreach ($flattenedData as &$record) {
            $record = [
                ...$record,
                ...$paramData,
            ];
        }
    }

    private function convertDateFormats(array &$flattenedData, array $fieldMapping): void
    {
        foreach ($fieldMapping as $mapping) {
            if ($mapping->dateFormat == null) {
                continue;
            }

            $outputFormat = $mapping->fieldType === 'datetime' ? 'Y-m-d H:i:s' : 'Y-m-d';

            foreach ($flattenedData as &$record) {
                if (isset($record[$mapping->jsonFieldPath])) {
                    $record[$mapping->jsonFieldPath] = Carbon::createFromFormat(
                        $mapping->dateFormat,
                        $record[$mapping->jsonFieldPath]
                    )->format($outputFormat);
                }
            }
        }
    }

    private function mapFields(array $flattenedData, array $fieldMapping): array
    {
        // Create a mapping from JSON field paths to data table columns
        $pathToColumnMap = $this->buildPathToColumnMap($fieldMapping);

        $mappedData = [];

        foreach ($flattenedData as $record) {
            $mappedRecord = [];

            foreach ($record as $jsonFieldPath => $value) {
                // Check if this JSON field path has a mapping to a data table column
                if (isset($pathToColumnMap[$jsonFieldPath])) {
                    $dataTableColumn = $pathToColumnMap[$jsonFieldPath];
                    $mappedRecord[$dataTableColumn] = $value;
                }
            }

            if (! empty($mappedRecord)) {
                $mappedData[] = $mappedRecord;
            }
        }

        return $mappedData;
    }

    /**
     * Build a mapping array from JSON field paths to data table column names
     *
     * @param  FieldMappingData[]  $fieldMapping
     * @return array<string, string>
     */
    private function buildPathToColumnMap(array $fieldMapping): array
    {
        $pathToColumnMap = [];

        foreach ($fieldMapping as $mapping) {
            if ($mapping->jsonFieldPath !== null && $mapping->jsonFieldPath !== '') {
                $pathToColumnMap[$mapping->jsonFieldPath] = $mapping->column;
            }
        }

        return $pathToColumnMap;
    }
}
