<?php

namespace App\Services\DataLoader\JsonStructure;

class CalculateJsonStructure
{
    private int $uuid = 0;

    public function __construct() {}

    public function calculate(array $jsonData): ?JsonStructureDefinition
    {

        $this->uuid = 0;

        $primaryDefinition = $this->getDefinition($jsonData, 'response');

        $primaryDefinition->primaryField = true;

        return new JsonStructureDefinition(
            $this->uuid,
            $primaryDefinition
        );
    }

    /**
     * @param  array|string|float|int|null|bool  $jsonData
     */
    private function getDefinition(mixed $jsonData, string $fieldName): ?JsonDefinition
    {

        // value is primitive
        if (! is_array($jsonData)) {
            return new JsonDefinition(
                $this->uuid++,
                $fieldName,
                'primitive',
                false,
                []
            );
        }

        if (empty($jsonData)) {
            return new JsonDefinition(
                $this->uuid++,
                $fieldName,
                'primitive-array',
                false,
                []
            );
        }

        //key value pairs
        if (! $this->isSequentialArray($jsonData)) {
            $childDefinitions = [];
            foreach ($jsonData as $key => $value) {
                $childDefinitions[] = $this->getDefinition($value, $key);
            }

            return new JsonDefinition(
                $this->uuid++,
                $fieldName,
                'object',
                false,
                $childDefinitions
            );
        }

        //if array is empty or if first element is primitive/another sequential array
        if (! is_array($jsonData[0]) || $this->isSequentialArray($jsonData[0])) {
            return new JsonDefinition(
                $this->uuid++,
                $fieldName,
                'primitive-array',
                false,
                []
            );
        }

        //if array is not empty and first element is an object
        $firstElement = $jsonData[0];
        $childDefinitions = [];
        foreach ($firstElement as $key => $value) {
            $childDefinitions[] = $this->getDefinition($value, $key);
        }

        return new JsonDefinition(
            $this->uuid++,
            $fieldName,
            'array',
            false,
            $childDefinitions
        );
    }

    private function isSequentialArray(array $array): bool
    {
        return array_keys($array) === range(0, count($array) - 1);
    }
}
