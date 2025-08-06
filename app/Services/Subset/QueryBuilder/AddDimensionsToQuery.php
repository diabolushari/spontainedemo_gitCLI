<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetailDimension;
use Illuminate\Database\Eloquent\Collection;

class AddDimensionsToQuery
{
    /**
     * @param  Collection<int, SubsetDetailDimension>  $dimensions
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    public function addDimensionFields(
        Collection $dimensions,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns,
        bool $isSummary,
        ?array $fields
    ): void {
        $dimensions->each(function (SubsetDetailDimension $dimension) use (&$groupingColumns, &$selectColumns, &$orderColumns, $isSummary, $fields) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filter_only == 1) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($dimension->subset_column, $fields)) {
                return;
            }

            //if is summary then section info is included in as office_code, office_name
            if ($isSummary && $dimension->info->column === 'section_code') {
                return;
            }
            if ($dimension->column_expression != null) {
                $groupingColumns[] = $dimension->column_expression;
                $selectColumns[] = $dimension->column_expression.' as `'.$dimension->subset_column.'`';
                if ($dimension->sort_order != null) {
                    $orderColumns[] = new SubsetFieldOrderInfo($dimension->column_expression, $dimension->sort_order);
                }

                return;
            }

            $groupingColumns[] = '`'.$dimension->info->column.'`';
            $selectColumns[] = $dimension->info->column.'_record.name as `'.$dimension->subset_column.'`';

            if ($dimension->sort_order != null) {
                $sortOrder = $dimension->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $dimension->info->column.'_record.name',
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }
}
