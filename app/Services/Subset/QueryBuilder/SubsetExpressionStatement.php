<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Models\Subset\SubsetDetailText;

trait SubsetExpressionStatement
{
    private function dateStatement(SubsetDetailDate $dateField): string
    {
        if ($dateField->date_field_expression != null) {
            return $dateField->date_field_expression;
        }

        return '`'.$dateField->info->column.'`';

    }

    private function dimensionStatement(SubsetDetailDimension $dimension): string
    {
        if ($dimension->column_expression != null) {
            return $dimension->column_expression;
        }

        return '`'.$dimension->info->column.'_record`.`name`';
    }

    private function measureStatement(SubsetDetailMeasure $measure): string
    {
        $column = '`'.$measure->info->column.'`';
        if ($measure->expression != null) {
            $column = $measure->expression;
        } elseif ($measure->aggregation != null) {
            //if weighted avg then use weight aggregation
            if ($measure->aggregation === 'WEIGHTED_AVG') {
                if ($measure->weightInfo == null) {
                    return $column;
                }
                $column = 'SUM('.$measure->info->column.' * '.$measure->weightInfo->column.') / SUM('
                    .$measure->weightInfo->column.')';
            } else {
                $column = $measure->aggregation.'('.$measure->info->column.')';
            }
        }

        return $column;
    }

    private function textStatement(SubsetDetailText $text): string
    {
        return '`'.$text->info->column.'`';
    }
}
