<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetailDate;
use Illuminate\Database\Eloquent\Collection;

class AddDatesToQuery
{
    /**
     * @param  Collection<int, SubsetDetailDate>  $dates
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    public function addDateFields(
        Collection $dates,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns,
        ?array $fields
    ): void {
        $dates->each(function (SubsetDetailDate $date) use (&$groupingColumns, &$selectColumns, &$orderColumns, $fields) {
            if ($date->info == null) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($date->subset_column, $fields)) {
                return;
            }

            if ($date->date_field_expression != null) {
                $column = $date->date_field_expression;
            } else {
                $column = '`'.$date->info->column.'`';
            }
            $groupingColumns[] = $column;
            $selectColumns[] = $column.' as `'.$date->subset_column.'`';
            if ($date->sort_order != null) {
                $sortOrder = $date->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $column,
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }
}
