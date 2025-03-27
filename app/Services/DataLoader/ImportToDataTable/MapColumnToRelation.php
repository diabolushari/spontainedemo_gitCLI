<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Models\DataTable\DataTableRelation;
use Illuminate\Database\Eloquent\Collection;

class MapColumnToRelation
{
    /**
     * Map field mappings to their corresponding relations
     *
     * @param  array{
     *     field_id: int,
     *     field_name: string,
     *     field_type: string,
     *     data_table_column: string|null
     * }[]|null  $fieldMappings
     * @param  Collection<DataTableRelation>  $relations
     * @return RelationColumnInfo[]
     */
    public function map(?array $fieldMappings, Collection $relations): array
    {
        if ($fieldMappings === null) {
            return [];
        }

        $result = [];

        foreach ($fieldMappings as $fieldMapping) {
            $matchingRelation = $this->findMatchingRelation($fieldMapping, $relations);

            if ($matchingRelation !== null) {
                $result[] = new RelationColumnInfo(
                    FieldMappingData::from($fieldMapping),
                    $matchingRelation,
                );
            }
        }

        return $result;
    }

    /**
     * Find a matching relation for a field mapping
     *
     * @param  array{
     *     field_id: int,
     *     field_name: string,
     *     field_type: string,
     *     data_table_column: string|null
     * }  $fieldMapping
     * @param  Collection<DataTableRelation>  $relations
     */
    private function findMatchingRelation(array $fieldMapping, Collection $relations): ?DataTableRelation
    {
        if ($fieldMapping['data_table_column'] === null) {
            return null;
        }

        foreach ($relations as $relation) {
            if (
                (
                    $fieldMapping['field_type'] === 'array' || $fieldMapping['field_type'] === 'object'
                )
                && $fieldMapping['data_table_column'] === (string) $relation->data_detail_id
            ) {
                return $relation;
            }
        }

        return null;
    }
}
