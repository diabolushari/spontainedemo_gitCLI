<?php

namespace App\Services\Subset;

use App\Models\Subset\SubsetDetail;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use Illuminate\Database\Query\Builder;

class SubsetFilterBuilder
{
    use SubsetExpressionStatement;

    public function __construct(
        public DistributionHierarchy $distributionHierarchy
    ) {}

    /**
     * @param  array<array-key, string>  $filters
     */
    public function filter(Builder $query, SubsetDetail $subsetDetail, array $filters): void
    {

        $subsetDetail->dates->each(function ($date) use ($filters, $query) {
            //check if date/date_from/date_to/date_in/date_not_in/date_not are set

            $column = $this->dateStatement($date);

            if (isset($filters[$date->subset_column])) {
                $query->whereRaw($column.' =  ? ', [$filters[$date->subset_column]]);
            }
            if (isset($filters[$date->subset_column.'_not'])) {
                $query->whereRaw(
                    $column.' != ? ',
                    [$filters[$date->subset_column.'_not']]
                );
            }
            if (isset($filters[$date->subset_column.'_from'])) {
                $query->whereRaw($column.' >= ? ', [$filters[$date->subset_column.'_from']]);
            }
            if (isset($filters[$date->subset_column.'_to'])) {
                $query->whereRaw($column.' <= ? ', [$filters[$date->subset_column.'_to']]);
            }
            if (isset($filters[$date->subset_column.'_in'])) {
                $query->whereRaw($column.' IN ('.$filters[$date->subset_column.'_in'].') ');
            }
            if (isset($filters[$date->subset_column.'_not_in'])) {
                $query->whereRaw($column.' NOT IN ('.$filters[$date->subset_column.'_not_in'].')');
            }
        });

        $subsetDetail->dimensions->each(function ($dimension) use ($filters, $query) {
            if ($dimension->info->column === 'section_code' && isset($filters['office_code'])) {
                $sectionCode = $this->distributionHierarchy->findAllSection($filters['office_code']);
                $query->whereIn($dimension->info->column.'_record.name', array_column(
                    $sectionCode,
                    'section_code'
                ));

                return;
            }

            $column = $this->dimensionStatement($dimension);

            //check if dimension/dimension_in/dimension_not_in/dimension_not/dimension_like/dimension_not_like are set
            if (isset($filters[$dimension->subset_column])) {
                $query->whereRaw($column.' = ? ', [$filters[$dimension->subset_column]]);
            }
            if (isset($filters[$dimension->subset_column.'_not'])) {
                $query->whereRaw($column.' != ? ', [$filters[$dimension->subset_column.'_not']]);
            }
            if (isset($filters[$dimension->subset_column.'_like'])) {
                $query->whereRaw($column.' LIKE ? ', ['%'.$filters[$dimension->subset_column.'_like'].'%']);
            }
            if (isset($filters[$dimension->subset_column.'_not_like'])) {
                $query->whereRaw($column.' NOT LIKE ? ', ['%'.$filters[$dimension->subset_column.'_not_like'].'%']);
            }
            if (isset($filters[$dimension->subset_column.'_greater_than'])) {
                $query->whereRaw($column.' > ? ', [$filters[$dimension->subset_column.'_greater_than']]);
            }
            if (isset($filters[$dimension->subset_column.'_less_than'])) {
                $query->whereRaw($column.' < ? ', [$filters[$dimension->subset_column.'_less_than']]);
            }
            if (isset($filters[$dimension->subset_column.'_greater_than_or_equal'])) {
                $query->whereRaw($column.' >= ? ', [$filters[$dimension->subset_column.'_greater_than_or_equal']]);
            }
            if (isset($filters[$dimension->subset_column.'_less_than_or_equal'])) {
                $query->whereRaw($column.' <= ? ', [$filters[$dimension->subset_column.'_less_than_or_equal']]);
            }
            if (isset($filters[$dimension->subset_column.'_in'])) {
                $query->whereRaw($column.' IN ('.$filters[$dimension->subset_column.'_in'].') ');
            }
            if (isset($filters[$dimension->subset_column.'_not_in'])) {
                $query->whereRaw($column.' NOT IN ('.$filters[$dimension->subset_column.'_not_in'].') ');
            }
        });

        $subsetDetail->measures->each(function ($measure) use ($filters, $query, $subsetDetail) {
            //check if measure/measure_greater_than/measure_less_than/measure_in/measure_not_in/measure_not are set

            $column = $this->measureStatement($measure);
            $statement = null;
            $params = [];

            if (isset($filters[$measure->subset_column])) {
                $statement = $column.' = ? ';
                $params[] = $filters[$measure->subset_column];
            }
            if (isset($filters[$measure->subset_column.'_greater_than'])) {
                $statement = $column.' > ? ';
                $params[] = $filters[$measure->subset_column.'_greater_than'];
            }
            if (isset($filters[$measure->subset_column.'_less_than'])) {
                $statement = $column.' < ? ';
                $params[] = $filters[$measure->subset_column.'_less_than'];
            }
            if (isset($filters[$measure->subset_column.'_greater_than_or_equal'])) {
                $statement = $column.' >= ? ';
                $params[] = $filters[$measure->subset_column.'_greater_than_or_equal'];
            }
            if (isset($filters[$measure->subset_column.'_less_than_or_equal'])) {
                $statement = $column.' <= ? ';
                $params[] = $filters[$measure->subset_column.'_less_than_or_equal'];
            }

            if ($statement != null) {
                if ($subsetDetail->group_data == 1) {
                    $query->havingRaw($statement, $params);
                } else {
                    $query->whereRaw($statement, $params);
                }
            }

            if (isset($filters[$measure->subset_column.'_in'])) {
                if ($subsetDetail->group_data == 1) {
                    $query->havingRaw($column.' IN ('.$filters[$measure->subset_column.'_in'].') ');
                } else {
                    $query->whereRaw($column.' IN ('.$filters[$measure->subset_column.'_in'].') ');
                }
            }
            if (isset($filters[$measure->subset_column.'_not_in'])) {
                if ($subsetDetail->group_data == 1) {
                    $query->havingRaw($column.' NOT IN ('.$filters[$measure->subset_column.'_not_in'].') ');
                } else {
                    $query->whereRaw($column.' NOT IN ('.$filters[$measure->subset_column.'_not_in'].') ');
                }
            }
        });

    }
}
