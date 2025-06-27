<?php

namespace App\Services\Subset;

use App\Models\Meta\MetaHierarchyItem;
use App\Models\Subset\SubsetDetail;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use App\Services\MetaData\Hierarchy\HierarchyChildList;
use Illuminate\Database\Query\Builder;

class SubsetFilterBuilder
{
    use SubsetExpressionStatement;

    public function __construct(
        public DistributionHierarchy $distributionHierarchy,
        private readonly HierarchyChildList $hierarchyChildList
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
                $splited = explode(',', $filters[$date->subset_column.'_in']);
                $query->where(function (Builder $query) use ($column, $splited) {
                    foreach ($splited as $split) {
                        $query->orWhereRaw($column.' = ? ', [$split]);
                    }
                });
            }
            if (isset($filters[$date->subset_column.'_not_in'])) {
                $splited = explode(',', $filters[$date->subset_column.'_not_in']);
                $query->where(function (Builder $query) use ($column, $splited) {
                    foreach ($splited as $split) {
                        $query->whereRaw($column.' != ? ', [$split]);
                    }
                });
            }
        });

        $subsetDetail->dimensions->each(function ($dimension) use ($filters, $query) {

            $column = $this->dimensionStatement($dimension);

            if ($dimension->hierarchy != null && isset($filters[$dimension->hierarchy->primary_column])) {
                $searchValue = $filters[$dimension->hierarchy->primary_column];
                $hierarchyItem = MetaHierarchyItem::where('meta_hierarchy_id', $dimension->hierarchy_id)
                    ->whereHas('primaryField', function ($query) use ($searchValue) {
                        $query->where('name', $searchValue);
                    })
                    ->first();

                if ($hierarchyItem == null) {
                    return;
                }

                $childrenMetaValues = $this->hierarchyChildList->getChildren($hierarchyItem)
                    ->map(function ($child) {
                        return $child->primaryField->name;
                    })
                    ->toArray();

                $query->whereIn($dimension->info->column.'_record.name', [
                    $hierarchyItem->primaryField->name,
                    ...$childrenMetaValues,
                ]);

            }

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
                $splited = explode(',', $filters[$dimension->subset_column.'_in']);
                $query->where(function (Builder $query) use ($column, $splited) {
                    foreach ($splited as $split) {
                        $query->orWhereRaw($column.' = ? ', [$split]);
                    }
                });
            }
            if (isset($filters[$dimension->subset_column.'_not_in'])) {
                $splited = explode(',', $filters[$dimension->subset_column.'_not_in']);
                $query->where(function (Builder $query) use ($column, $splited) {
                    foreach ($splited as $split) {
                        $query->whereRaw($column.' != ? ', [$split]);
                    }
                });
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
        });

    }
}
