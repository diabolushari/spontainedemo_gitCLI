<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetailMeasure;
use Illuminate\Database\Eloquent\Collection;

class AddMeasuresToQuery
{
    /**
     * @param  Collection<int, SubsetDetailMeasure>  $measures
     * @param  string[]  $measureColumns
     * @param  string[]  $groupingColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    public function addMeasureFields(
        Collection $measures,
        array &$measureColumns,
        array &$groupingColumns,
        array &$orderColumns,
        ?array $fields
    ): void {
        $measures->each(function (SubsetDetailMeasure $measure) use (&$measureColumns, &$groupingColumns, &$orderColumns, $fields) {
            if ($measure->info == null) {
                return;
            }
            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($measure->subset_column, $fields)) {
                return;
            }
            if ($measure->info->unit_column != null) {
                $measureColumns[] = '`'.$measure->info->unit_column.'` as `'.$measure->subset_column.'`';
                $groupingColumns[] = '`'.$measure->info->unit_column.'`';
            }
            $column = '`'.$measure->info->column.'`';
            if ($measure->expression != null) {
                $column = $measure->expression;
            } elseif ($measure->aggregation != null) {
                //if weighted avg then use weight aggregation
                if ($measure->aggregation === 'WEIGHTED_AVG') {
                    if ($measure->weightInfo == null) {
                        return;
                    }
                    $column = 'SUM('.$measure->info->column.' * '.$measure->weightInfo->column.') / SUM('
                        .$measure->weightInfo->column.')';
                } else {
                    $column = $measure->aggregation.'('.$measure->info->column.')';
                }
            }

            $measureColumns[] = $column.' as `'.$measure->subset_column.'`';
            if ($measure->sort_order != null) {
                $sortOrder = $measure->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $column,
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }

        });
    }
}
