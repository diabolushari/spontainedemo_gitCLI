<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\Meta\MetaData;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

trait DeleteDuplicateEntriesForField
{
    /**
     * Delete the existing values for field in new data provided from data table
     * for dimension's text is mapped to metadata_id
     * dates can be deleted directly
     *
     * @param  mixed[]  $data
     */
    private function deleteDuplicateEntries(
        DataDetail $dataDetail,
        string $column,
        array $data
    ): void {
        /**
         * /**
         */
        Log::debug('testing for column', ['datadetail' => $dataDetail, 'column' => $column, 'data' => $data]);
        $columns = array_map('trim', explode(',', $column));
        if (count($columns) == 1) {
            $uniqueValuesToBeDeleted = array_values(array_unique(array_column($data, $column)));

            /** @var string[]|int[] $uniqueValuesToBeDeleted */
            $toBeDeleted = [];

            DataTableDate::where('data_detail_id', $dataDetail->id)
                ->get()
                ->each(function (DataTableDate $tableField) use ($uniqueValuesToBeDeleted, &$toBeDeleted, $column) {
                    if ($tableField->column === $column) {
                        $toBeDeleted = $uniqueValuesToBeDeleted;
                    }
                });

            DataTableDimension::where('data_detail_id', $dataDetail->id)
                ->get()
                ->each(function (DataTableDimension $tableField) use ($uniqueValuesToBeDeleted, &$toBeDeleted, $column) {
                    if ($tableField->column === $column) {
                        $toBeDeleted = MetaData::where('meta_structure_id', $tableField->meta_structure_id)
                            ->whereIn('name', $uniqueValuesToBeDeleted)
                            ->pluck('id');
                    }
                });

            do {
                $deleted = DB::table($dataDetail->table_name)
                    ->whereIn($column, $toBeDeleted)
                    ->orderBy('id')
                    ->limit(10000)
                    ->delete();
            } while ($deleted > 0);
        } else {
            // Extract unique combinations of all column values
            $uniqueCombinations = [];
            foreach ($data as $row) {
                $combination = [];
                foreach ($columns as $column) {
                    $combination[$column] = $row[$column] ?? null;
                }
                $key = serialize($combination);
                if (! isset($uniqueCombinations[$key])) {
                    $uniqueCombinations[$key] = $combination;
                }
            }
            $uniqueCombinations = array_values($uniqueCombinations);

            // Map dimension columns to their metadata_ids
            /** @var array<string, array<string, int>> $dimensionMappings */
            $dimensionMappings = [];

            foreach ($columns as $column) {
                $dimension = DataTableDimension::where('data_detail_id', $dataDetail->id)
                    ->where('column', $column)
                    ->first();

                if ($dimension) {
                    $uniqueValues = array_values(array_unique(array_column($data, $column)));
                    $metaData = MetaData::where('meta_structure_id', $dimension->meta_structure_id)
                        ->whereIn('name', $uniqueValues)
                        ->get(['id', 'name']);

                    $dimensionMappings[$column] = $metaData->pluck('id', 'name')->toArray();
                }
            }

            // Delete rows matching the unique combinations in batches
            do {
                $deleted = DB::table($dataDetail->table_name)
                    ->where(function ($query) use ($uniqueCombinations, $columns, $dimensionMappings) {
                        foreach ($uniqueCombinations as $combination) {
                            $query->orWhere(function ($subQuery) use ($combination, $columns, $dimensionMappings) {
                                foreach ($columns as $column) {
                                    $value = $combination[$column];

                                    // Use mapped metadata_id if this is a dimension column
                                    if (isset($dimensionMappings[$column][$value])) {
                                        $value = $dimensionMappings[$column][$value];
                                    }

                                    $subQuery->where($column, $value);
                                }
                            });
                        }
                    })
                    ->orderBy('id')
                    ->limit(10000)
                    ->delete();
            } while ($deleted > 0);
        }

    }
}
