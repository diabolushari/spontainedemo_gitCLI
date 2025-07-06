<?php

namespace App\Services\Subset;

use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Services\DataTable\JoinDataTable;
use App\Services\DistributionHierarchy\OfficeList;
use App\Services\Subset\QueryBuilder\SubsetExpressionStatement;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Log;

readonly class SubsetGroupedByColumn
{
    use SubsetApplyDefaultFilters;
    use SubsetExpressionStatement;

    public function __construct(
        private JoinDataTable $joinDataTable,
        private OfficeList $officeList
    ) {}

    public function getQuery(SubsetDetail $subsetDetail, string $column): Builder
    {
        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $subsetDetail->data_detail_id)
            ->first();

        $query = $this->joinDataTable->join($detail);

        $this->filterData($detail, $subsetDetail, $query);

        $this->checkIfDate($subsetDetail, $query, $column);
        $this->checkIfDimension($subsetDetail, $query, $column);

        return $query;
    }

    private function checkIfDate(SubsetDetail $subsetDetail, Builder $builder, string $column): void
    {
        foreach ($subsetDetail->dates as $date) {
            if ($date->subset_column === $column) {
                $columnExpression = $this->dateStatement($date);

                $builder->groupByRaw($columnExpression);
                $builder->selectRaw("$columnExpression as value");
            }
        }
    }

    private function checkIfDimension(SubsetDetail $subsetDetail, Builder $builder, string $column): void
    {
        foreach ($subsetDetail->dimensions as $dimension) {
            if ($dimension->subset_column === $column) {
                $columnExpression = $this->dimensionStatement($dimension);
                Log::info($columnExpression);
                $builder->groupByRaw($columnExpression);
                $builder->selectRaw("$columnExpression as value");
            }
        }
    }
}
