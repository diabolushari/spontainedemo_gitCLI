<?php

declare(strict_types=1);

namespace App\Services\DataLoader\JsonStructure;

final readonly class FlattenJsonResponse
{
    /**
     * Summary of flatten
     *
     * @param  array<int, \App\Http\Requests\DataLoader\FieldMappingData>|null  $fieldMapping
     * @return array<int, array<string, string|int|float|null>>
     */
    public function flatten(array $data, string $separator = '.', string $startingPrefix = '', ?array $fieldMapping = null): array
    {
        $flattened = $this->flattenItem($data, $separator, $startingPrefix, $fieldMapping);

        if ($this->isSequentialArray($flattened)) {
            return $flattened;
        }

        return [$flattened];
    }

    /**
     * @param  array<int, \App\Http\Requests\DataLoader\FieldMappingData>|null  $fieldMapping
     */
    private function flattenItem(array $data, string $separator, string $prefix, ?array $fieldMapping = null): array
    {
        $result = [];

        // Build a set of field paths that should be processed
        $allowedPaths = null;
        if ($fieldMapping !== null) {
            $allowedPaths = [];
            foreach ($fieldMapping as $mapping) {
                if ($mapping->jsonFieldPath !== null) {
                    $allowedPaths[] = $mapping->jsonFieldPath;
                }
            }
        }

        //for processing object
        if (! $this->isSequentialArray($data)) {
            $primitives = [];
            $childRows = [];

            foreach ($data as $key => $value) {
                $currentPath = "$prefix.$key";

                //if the  value is not an array, we can add it directly to the primitives
                if (! is_array($value)) {
                    $primitives[$currentPath] = $value;
                }
                //for processing child object
                if (is_array($value) && ! $this->isSequentialArray($value)) {
                    // Only process child if it's in the field mapping or no mapping provided
                    if (! $this->shouldProcessPath($currentPath, $allowedPaths)) {
                        continue;
                    }

                    $flattenedChild = $this->flattenItem($value, $separator, $currentPath, $fieldMapping);
                    //if child is sequential then insert to child rows
                    if ($this->isSequentialArray($flattenedChild)) {
                        $childRows = [
                            ...$childRows,
                            ...$flattenedChild,
                        ];
                    } else {
                        //if child is not sequential then insert to primitives
                        $primitives = [
                            ...$primitives,
                            ...$flattenedChild,
                        ];
                    }
                }
                //the field is an array
                if (is_array($value) && $this->isSequentialArray($value)) {
                    // Only process array if it's in the field mapping or no mapping provided
                    if (! $this->shouldProcessPath($currentPath, $allowedPaths)) {
                        continue;
                    }

                    $flattenedArray = $this->flattenItem($value, $separator, $currentPath, $fieldMapping);
                    if ($this->isSequentialArray($flattenedArray)) {
                        $childRows = [
                            ...$childRows,
                            ...$flattenedArray,
                        ];
                    } else {
                        $primitives = [
                            ...$primitives,
                            ...$flattenedArray,
                        ];
                    }
                }
            }
            if (empty($childRows)) {
                return $primitives;
            }
            //add primitives to each child row
            foreach ($childRows as $childRow) {
                $result[] = [
                    ...$childRow,
                    ...$primitives,
                ];
            }
        }

        //for processing array
        if (is_array($data) && $this->isSequentialArray($data)) {
            foreach ($data as $item) {
                //when its primitive array
                if (! is_array($item)) {
                    $result[] = [
                        $prefix => $item,
                    ];

                    continue;
                }
                //array of objects
                $flattenedItem = $this->flattenItem($item, $separator, $prefix, $fieldMapping);
                if ($this->isSequentialArray($flattenedItem)) {
                    $result = [
                        ...$result,
                        ...$flattenedItem,
                    ];
                } else {
                    $result[] = $flattenedItem;
                }
            }
        }

        return $result;
    }

    private function isSequentialArray(array $array): bool
    {
        return array_keys($array) === range(0, count($array) - 1);
    }

    /**
     * Check if a path should be processed based on field mapping
     *
     * @param  array<int, string>|null  $allowedPaths
     */
    private function shouldProcessPath(string $path, ?array $allowedPaths): bool
    {
        // If no field mapping provided, process all paths
        if ($allowedPaths === null) {
            return true;
        }

        // Check if this path or any parent path is in the allowed paths
        foreach ($allowedPaths as $allowedPath) {
            if (str_starts_with($allowedPath, $path)) {
                return true;
            }
        }

        return false;
    }
}
