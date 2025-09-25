<?php

declare(strict_types=1);

namespace App\Services\DataLoader\JsonStructure;

final readonly class FlattenJsonResponse
{
    /**
     * Summary of flatten
     *
     * @return array<int, array<string, string|int|float|null>>
     */
    public function flatten(array $data, string $separator = '.', string $startingPrefix = ''): array
    {
        $flattened = $this->flattenItem($data, $separator, $startingPrefix);

        if ($this->isSequentialArray($flattened)) {
            return $flattened;
        }

        return [$flattened];
    }

    private function flattenItem(array $data, string $separator, string $prefix): array
    {
        $result = [];

        //for processing object
        if (! $this->isSequentialArray($data)) {
            $primitives = [];
            $childRows = [];

            foreach ($data as $key => $value) {
                //if the  value is not an array, we can add it directly to the primitives
                if (! is_array($value)) {
                    $primitives["$prefix.$key"] = $value;
                }
                //for processing child object
                if (is_array($value) && ! $this->isSequentialArray($value)) {
                    $flattenedChild = $this->flattenItem($value, $separator, "$prefix.$key");
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
                    $flattenedArray = $this->flattenItem($value, $separator, "$prefix.$key");
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
                $flattenedItem = $this->flattenItem($item, $separator, $prefix);
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
}
