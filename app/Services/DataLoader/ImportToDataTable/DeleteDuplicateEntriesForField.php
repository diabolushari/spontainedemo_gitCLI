<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\Meta\MetaData;
use Illuminate\Support\Facades\DB;

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
    }
}
