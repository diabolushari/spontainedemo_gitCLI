<?php

namespace App\Services\DataLoader\JsonStructure;

use App\Services\DataLoader\Contracts\DataFetcherInterface;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\FetchData\FetchJSONAPI;
use Exception;
use GuzzleHttp\Exception\GuzzleException;

class GetPrimaryFieldData implements DataFetcherInterface
{
    public function __construct(
        private readonly FetchJSONAPI $fetchJSONAPI,
        private readonly FindJsonPrimaryField $findJsonPrimaryField
    ) {}

    /**
     * Get the primary field data from the JSON response
     *
     * @throws GuzzleException When the API request fails
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array
    {
        if ($dataSource->type !== 'REST_API' || $dataSource->apiInfo === null) {
            throw new Exception('Invalid data source type for API');
        }

        $responseStructure = JsonStructureDefinition::from($dataSource->apiInfo->response_structure);

        $pathToPrimary = $this->findJsonPrimaryField->findPathToPrimary($responseStructure->definition);

        // Convert KeyValue items to associative arrays
        $headers = [];
        if ($dataSource->apiInfo->headers) {
            foreach ($dataSource->apiInfo->headers as $header) {
                $headers[$header['key']] = $header['value'];
            }
        }

        $body = [];
        if ($dataSource->apiInfo->body) {
            foreach ($dataSource->apiInfo->body as $param) {
                $body[$param['key']] = $param['value'];
            }
        }

        // Set up the API request
        $this->fetchJSONAPI
            ->setUrl($dataSource->apiInfo->url)
            ->setMethod($dataSource->apiInfo->method)
            ->setHeaders($headers)
            ->setBody($body);

        // Fetch the data
        $data = $this->fetchJSONAPI->getData();

        return $this->traverseStructure($data, $pathToPrimary);
    }

    /**
     * @param  JsonDefinition[]  $pathToPrimary
     *
     * @throws Exception
     */
    private function traverseStructure(array $data, array $pathToPrimary): array
    {
        if (empty($pathToPrimary)) {
            return $data;
        }
        $currentPathPosition = array_shift($pathToPrimary);
        if ($currentPathPosition->fieldName === 'root' && $currentPathPosition->fieldType !== 'array') {
            return $this->traverseStructure($data, $pathToPrimary);
        }

        if ($currentPathPosition->fieldName !== 'root' && ! isset($data[$currentPathPosition->fieldName])) {
            throw new Exception($currentPathPosition->fieldName.' is not present in the data');
        }
        $currentLevelData = $currentPathPosition->fieldName === 'root' ? $data : $data[$currentPathPosition->fieldName];

        if ($currentPathPosition->fieldType === 'array') {
            if (! $this->isSequential($currentLevelData)) {
                throw new Exception($currentPathPosition->fieldName.' : Array is not sequential');
            }
            //traverse each item in array and find result
            $result = [];
            foreach ($currentLevelData as $item) {
                $response = $this->traverseStructure($item, $pathToPrimary);
                if ($this->isSequential($response)) {
                    $result = array_merge($result, $response);
                } else {
                    $result[] = $response;
                }
            }

            return $result;
        }

        if ($currentPathPosition->fieldType === 'primitive') {
            if (is_array($data[$currentPathPosition->fieldName])) {
                throw new Exception($currentPathPosition->fieldName.' is an array');
            }

            return [$currentPathPosition->fieldName => $data[$currentPathPosition->fieldName]];
        }

        if ($currentPathPosition->fieldType === 'primitive-array') {
            return [$currentPathPosition->fieldName => $data[$currentPathPosition->fieldName]];
        }

        if (isset($data[$currentPathPosition->fieldName])) {
            return $this->traverseStructure($data[$currentPathPosition->fieldName], $pathToPrimary);
        }

        throw new Exception('Unable to find '.$currentPathPosition->fieldName.' in the data.');
    }

    private function isSequential(array $array): bool
    {
        return array_keys($array) === range(0, count($array) - 1);
    }
}
