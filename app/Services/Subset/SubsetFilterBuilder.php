<?php

namespace App\Services\Subset;

use App\Models\Subset\SubsetDetail;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use Illuminate\Database\Query\Builder;

class SubsetFilterBuilder
{
    public function __construct(
        public DistributionHierarchy $distributionHierarchy
    ) {}

    /**
     * @param  array<array-key, string>  $filters
     */
    public function filter(Builder $query, SubsetDetail $subsetDetail, array $filters)
    {

        $subsetDetail->dates->each(function ($date) use ($filters, $query) {
            if ($date->info == null) {
                return;
            }
            //check if date/date_from/date_to/date_in/date_not_in/date_not are set
            if (isset($filters[$date->info->column])) {
                $query->where($date->info->column, $filters[$date->info->column]);
            }
            if (isset($filters[$date->info->column.'_not'])) {
                $query->where($date->info->column, '!=', $filters[$date->info->column.'_not']);
            }
            if (isset($filters[$date->info->column.'_from'])) {
                $query->where($date->info->column, '>=', $filters[$date->info->column.'_from']);
            }
            if (isset($filters[$date->info->column.'_to'])) {
                $query->where($date->info->column, '<=', $filters[$date->info->column.'_to']);
            }
            if (isset($filters[$date->info->column.'_in'])) {
                $query->whereIn($date->info->column, explode(',', $filters[$date->info->column.'_in']));
            }
            if (isset($filters[$date->info->column.'_not_in'])) {
                $query->whereNotIn($date->info->column, explode(',', $filters[$date->info->column.'_not_in']));
            }
        });

        $subsetDetail->dimensions->each(function ($dimension) use ($filters, $query) {
            if ($dimension->info == null) {
                return;
            }

            if ($dimension->info->column === 'section_code' && isset($filters['office_code'])) {
                $sectionCode = $this->distributionHierarchy->findAllSection($filters['office_code']);
                $query->whereIn($dimension->info->column.'_record.name', array_column(
                    $sectionCode,
                    'section_code'
                ));

                return;
            }

            //check if dimension/dimension_in/dimension_not_in/dimension_not/dimension_like/dimension_not_like are set
            if (isset($filters[$dimension->info->column])) {
                $query->where($dimension->info->column.'_record.name', $filters[$dimension->info->column]);
            }
            if (isset($filters[$dimension->info->column.'_not'])) {
                $query->where($dimension->info->column.'_record.name', '!=', $filters[$dimension->info->column.'_not']);
            }
            if (isset($filters[$dimension->info->column.'_like'])) {
                $query->where($dimension->info->column.'_record.name', 'like', '%'.$filters[$dimension->info->column.'_like'].'%');
            }
            if (isset($filters[$dimension->info->column.'_not_like'])) {
                $query->where($dimension->info->column.'_record.name', 'not like', '%'.$filters[$dimension->info->column.'_not_like'].'%');
            }
            if (isset($filters[$dimension->info->column.'_in'])) {
                $query->whereIn($dimension->info->column.'_record.name', explode(',', $filters[$dimension->info->column.'_in']));
            }
            if (isset($filters[$dimension->info->column.'_not_in'])) {
                $query->whereNotIn($dimension->info->column.'_record.name', explode(',', $filters[$dimension->info->column.'_not_in']));
            }
        });

        $subsetDetail->measures->each(function ($measure) use ($filters, $query) {
            if ($measure->info == null) {
                return;
            }
            //check if measure/measure_greater_than/measure_less_than/measure_in/measure_not_in/measure_not are set
            if (isset($filters[$measure->info->column])) {
                $query->where($measure->info->column, $filters[$measure->info->column]);
            }
            if (isset($filters[$measure->info->column.'_greater_than'])) {
                $query->where($measure->info->column, '>', $filters[$measure->info->column.'_greater_than']);
            }
            if (isset($filters[$measure->info->column.'_less_than'])) {
                $query->where($measure->info->column, '<', $filters[$measure->info->column.'_less_than']);
            }
            if (isset($filters[$measure->info->column.'_in'])) {
                $query->whereIn($measure->info->column, explode(',', $filters[$measure->info->column.'_in']));
            }
            if (isset($filters[$measure->info->column.'_not_in'])) {
                $query->whereNotIn($measure->info->column, explode(',', $filters[$measure->info->column.'_not_in']));
            }
        });

    }
}
