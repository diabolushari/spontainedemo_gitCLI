<?php

namespace App\Services\Subset;

use App\Models\Subset\SubsetDetail;
use Illuminate\Contracts\Database\Query\Builder;

readonly class GetSubsetData
{
    public function __construct(
        private SubsetQueryBuilder $queryBuilder,
        private SubsetFilterBuilder $filterBuilder,
        private SubsetQuerySorting $querySorting
    ) {}

    public function get(SubsetDetail $subsetDetail, bool $isSummary, bool $excludeNonMeasurements, string $summaryLevel = 'region'): ?Builder
    {
        $filterParams = request()->all();

        if ($subsetDetail->group_data == 0 && $isSummary) {
            return null;
        }

        $query = $this->queryBuilder->query(
            $subsetDetail,
            $isSummary,
            $excludeNonMeasurements,
            $summaryLevel
        );

        $this->filterBuilder->filter(
            $query,
            $subsetDetail,
            $filterParams
        );

        if (isset($filterParams['sort_by'])) {
            $this->querySorting->addSort(
                $query,
                $subsetDetail,
                false,
                $filterParams['sort_by'],
                $filterParams['sort_order'] ?? 'ASC',
            );
        }

        if (isset($filterParams['secondary_sort_by'])) {
            $this->querySorting->addSort(
                $query,
                $subsetDetail,
                false,
                $filterParams['secondary_sort_by'],
                $filterParams['secondary_sort_order'] ?? 'ASC',
            );
        }

        return $query;

    }
}
