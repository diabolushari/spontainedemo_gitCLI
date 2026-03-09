<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetailText;
use Illuminate\Database\Eloquent\Collection;

class AddTextsToQuery
{
    /**
     * @param  Collection<int, SubsetDetailText>  $texts
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    public function addTextFields(
        Collection $texts,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns,
        ?array $fields
    ): void {
        $texts->each(function (SubsetDetailText $text) use (&$groupingColumns, &$selectColumns, &$orderColumns, $fields) {
            if ($text->info == null) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($text->subset_column, $fields)) {
                return;
            }

            $groupingColumns[] = '`'.$text->info->column.'`';
            $selectColumns[] = $text->info->column.' as `'.$text->subset_column.'`';

            if ($text->sort_order != null) {
                $sortOrder = $text->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $text->info->column,
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }
}
