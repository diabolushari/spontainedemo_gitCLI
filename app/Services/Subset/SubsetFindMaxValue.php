<?php

namespace App\Services\Subset;

use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Services\DataTable\JoinDataTable;

class SubsetFindMaxValue
{
    use SubsetApplyDefaultFilters;
    use SubsetExpressionStatement;

    public function __construct(
        private readonly JoinDataTable $joinDataTable
    ) {}

    /**
     * find the max value of given column in subset and return it
     * null is returned if column is not in subset
     * or if value is empty
     */
    public function findMaxValue(SubsetDetail $subsetDetail, string $column): ?object
    {
        $latestValue = null;

        $subsetDetail->dates->each(function (SubsetDetailDate $date) use (&$latestValue, $column, $subsetDetail) {

            if ($column === $date->subset_column) {
                $expression = $this->dateStatement($date);

                $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
                    ->where('id', $subsetDetail->data_detail_id)
                    ->first();

                $query = $this->joinDataTable->join($detail);

                $this->filterData($detail, $subsetDetail, $query);

                $latestValue = $query
                    ->groupByRaw($expression)
                    ->selectRaw("MAX($expression) as max_value")
                    ->first();

            }
        });

        $subsetDetail->dimensions->each(function (SubsetDetailDimension $dimension) use (&$latestValue, $column, $subsetDetail) {
            if ($column === $dimension->subset_column) {
                $expression = $this->dimensionStatement($dimension);

                $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
                    ->where('id', $subsetDetail->data_detail_id)
                    ->first();

                $query = $this->joinDataTable->join($detail);

                $this->filterData($detail, $subsetDetail, $query);

                $latestValue = $query
                    ->groupByRaw($expression)
                    ->selectRaw("MAX($expression) as max_value")
                    ->first();
            }
        });

        return $latestValue;
    }
}
