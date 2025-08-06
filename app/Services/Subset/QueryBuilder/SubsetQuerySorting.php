<?php

namespace App\Services\Subset\QueryBuilder;

use App\Models\Subset\SubsetDetail;
use Illuminate\Database\Query\Builder;

class SubsetQuerySorting
{
    use SubsetExpressionStatement;

    /**
     * Add an order by statement to Query if the given field is in subset
     * for summary subsets dates/dimensions are excluded
     */
    public function addSort(
        Builder $queryBuilder,
        SubsetDetail $subsetDetail,
        bool $excludeNonMeasurements,
        string $column,
        string $sortOrder = 'ASC'
    ): void {

        $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

        if (! $excludeNonMeasurements) {
            foreach ($subsetDetail->dates as $date) {
                if ($date->subset_column == $column) {
                    $expression = $this->dateStatement($date);
                    $queryBuilder->orderByRaw($expression.' '.$sortOrder);
                }
            }

            foreach ($subsetDetail->dimensions as $dimension) {
                if ($dimension->subset_column == $column) {
                    $expression = $this->dimensionStatement($dimension);
                    $queryBuilder->orderByRaw($expression.' '.$sortOrder);
                }
            }
        }

        foreach ($subsetDetail->measures as $measure) {
            if ($measure->subset_column == $column) {
                $expression = $this->measureStatement($measure);
                $queryBuilder->orderByRaw($expression.' '.$sortOrder);
            }
        }

    }
}
