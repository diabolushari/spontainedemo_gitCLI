<?php

namespace App\Services\Subset;

use App\Models\Subset\SubsetDetail;
use App\Services\Subset\QueryBuilder\SubsetFilterBuilder;
use App\Services\Subset\QueryBuilder\SubsetQueryBuilder;
use App\Services\Subset\QueryBuilder\SubsetQuerySorting;
use Illuminate\Contracts\Database\Query\Builder;

class GetSubsetData
{
    private array $filters = [];

    private bool $isSummary = false;

    private bool $excludeNonMeasurements = false;

    private ?string $summaryLevel = null;

    private ?SubsetDetail $subsetDetail = null;

    private ?string $dimension = null;

    public function __construct(
        private SubsetQueryBuilder $queryBuilder,
        private SubsetFilterBuilder $filterBuilder,
        private SubsetQuerySorting $querySorting,
    ) {
    }

    public function setFilters(array $filters): self
    {
        $this->filters = $filters;

        return $this;
    }

    public function withSummary(bool $isSummary): self
    {
        $this->isSummary = $isSummary;

        return $this;
    }

    public function excludeNonMeasurements(bool $exclude): self
    {
        $this->excludeNonMeasurements = $exclude;

        return $this;
    }

    public function withSummaryLevel(string $summaryLevel): self
    {
        $this->summaryLevel = $summaryLevel;

        return $this;
    }

    public function withSubsetDetail(int $subsetDetailId): self
    {
        $this->subsetDetail = SubsetDetail::where('id', $subsetDetailId)
            ->with('dates.info', 'measures.info', 'measures.weightInfo', 'dimensions.info')
            ->first();

        return $this;
    }

    public function withDimension(?string $dimension): self
    {
        $this->dimension = $dimension;

        return $this;
    }

    /**
     * Get the fields filter from the filters
     *
     * @return string[]|null
     */
    public function getFields(): ?array
    {
        if (!isset($this->filters['fields']) || empty($this->filters['fields'])) {
            return null;
        }

        return explode(',', $this->filters['fields']);
    }

    public function getQuery(): ?Builder
    {
        if ($this->subsetDetail == null || ($this->subsetDetail->group_data == 0 && $this->isSummary)) {
            return null;
        }

        $query = $this->queryBuilder->query(
            $this->subsetDetail,
            $this->isSummary,
            $this->excludeNonMeasurements,
            $this->summaryLevel,
            $this->getFields(),
            $this->dimension
        );

        $this->filterBuilder->filter(
            $query,
            $this->subsetDetail,
            $this->filters
        );

        if (isset($this->filters['sort_by'])) {
            $this->querySorting->addSort(
                $query,
                $this->subsetDetail,
                false,
                $this->filters['sort_by'],
                $this->filters['sort_order'] ?? 'ASC',
            );
        }

        if (isset($this->filters['secondary_sort_by'])) {
            $this->querySorting->addSort(
                $query,
                $this->subsetDetail,
                false,
                $this->filters['secondary_sort_by'],
                $this->filters['secondary_sort_order'] ?? 'ASC',
            );
        }

        return $query;
    }
}
