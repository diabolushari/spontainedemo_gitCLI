<?php

namespace App\Services\DataLoader\Connection;

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Services\DataLoader\Contracts\DataFetcherInterface;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\JsonStructure\PerformJSONProcessing;
use Exception;

final class GetProcessedQueryResult implements DataFetcherInterface
{
    public function __construct(
        private readonly RunLoaderQuery $runLoaderQuery,
        private readonly PerformJSONProcessing $performJSONProcessing,
    ) {}

    /**
     * Fetch data from the source with validation
     *
     * @return array[]
     *
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array
    {
        // Delegate to the wrapped service
        $data = $this->runLoaderQuery->fetchData($dataSource);

        // If field mapping is present, process the data
        if ($dataSource->fieldMapping != null) {
            // Remove 'response.' prefix from jsonFieldPath for SQL query results
            $transformedFieldMapping = $this->transformFieldMapping($dataSource->fieldMapping);

            return $this->performJSONProcessing->handle(
                $data,
                $transformedFieldMapping,
                []
            );
        }

        // Return raw data if no field mapping
        return $data;
    }

    /**
     * Transform field mapping by removing 'response.' prefix from jsonFieldPath
     *
     * @param  FieldMappingData[]  $fieldMapping
     * @return FieldMappingData[]
     */
    private function transformFieldMapping(array $fieldMapping): array
    {
        return array_map(function ($mapping) {
            $jsonFieldPath = $mapping->jsonFieldPath;

            // Remove 'response.' prefix if present
            if ($jsonFieldPath !== null && str_starts_with($jsonFieldPath, 'response.')) {
                $jsonFieldPath = substr($jsonFieldPath, strlen('response.'));
            }

            // Create a new instance with the transformed jsonFieldPath
            return new FieldMappingData(
                column: $mapping->column,
                fieldName: $mapping->fieldName,
                fieldType: $mapping->fieldType,
                jsonFieldPath: $jsonFieldPath,
                dateFormat: $mapping->dateFormat,
            );
        }, $fieldMapping);
    }
}
