<?php

namespace App\Services\Subset;

use App\Models\DataDetail\DataDetail;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyLevelInfo;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Services\DataTable\JoinDataTable;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use App\Services\MetaData\Hierarchy\FlattenHierarchyAtLevel;
use App\Services\MetaData\Hierarchy\HierarchySubQuery;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\Builder;

readonly class SubsetQueryBuilder
{
    use FlattenHierarchyAtLevel;
    use GetHierarchyTableDetail;
    use HierarchySubQuery;
    use SubsetApplyDefaultFilters;

    public function __construct(
        private JoinDataTable $joinDataTable,
    ) {}

    public function query(
        SubsetDetail $subsetDetail,
        bool $isSummary,
        bool $excludeNonMeasurements,
        ?string $summaryLevel,
        ?array $fields
    ): Builder {

        /** @var string[] $groupingColumns */
        $groupingColumns = [];
        /** @var string[] $selectColumns */
        $selectColumns = [];
        /** @var string[] $measureColumns */
        $measureColumns = [];
        /** @var SubsetFieldOrderInfo[] $orderColumns */
        $orderColumns = [];

        if (! $excludeNonMeasurements) {
            $this->addDateFields(
                $subsetDetail->dates,
                $groupingColumns,
                $selectColumns,
                $orderColumns,
                $fields
            );
            $this->addDimensionFields(
                $subsetDetail->dimensions,
                $groupingColumns,
                $selectColumns,
                $orderColumns,
                $isSummary,
                $fields
            );
        }

        $this->addMeasureFields($subsetDetail->measures, $measureColumns, $groupingColumns, $orderColumns);

        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $subsetDetail->data_detail_id)
            ->first();

        $query = $this->joinDataTable->join($detail);

        if (! $isSummary) {
            $this->includeHierarchy(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns,
                $fields
            );
        }

        if ($isSummary) {
            $this->groupByDimension(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns,
                $summaryLevel
            );
        }

        $selectStatement = implode(',', [
            ...$selectColumns,
            ...$measureColumns,
        ]);

        if ($subsetDetail->group_data == 1 && count($groupingColumns) > 0) {
            $groupByStatement = implode(',', $groupingColumns);
            $query->groupByRaw($groupByStatement);
        }

        $this->filterData($detail, $subsetDetail, $query);

        //if request has limit parameter the use it instead of max_rows_to_fetch
        if ($subsetDetail->max_rows_to_fetch != null || request()->filled('limit')) {
            $limit = request()->input('limit') ?? $subsetDetail->max_rows_to_fetch;
            if (is_numeric($limit)) {
                $query->take($limit);
            }
        }

        foreach ($orderColumns as $order) {
            $query->orderByRaw($order->column . ' ' . $order->sortOrder);
        }

        return $query->selectRaw($selectStatement);
    }

    /**
     * @param  Collection<int, SubsetDetailDate>  $dates
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    private function addDateFields(
        Collection $dates,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns,
        ?array $fields
    ): void {
        $dates->each(function (SubsetDetailDate $date) use (&$groupingColumns, &$selectColumns, &$orderColumns, $fields) {
            if ($date->info == null) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($date->subset_column, $fields)) {
                return;
            }

            if ($date->date_field_expression != null) {
                $column = $date->date_field_expression;
            } else {
                $column = '`' . $date->info->column . '`';
            }
            $groupingColumns[] = $column;
            $selectColumns[] = $column . ' as `' . $date->subset_column . '`';
            if ($date->sort_order != null) {
                $sortOrder = $date->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $column,
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }

    /**
     * @param  Collection<int, SubsetDetailDimension>  $dimensions
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     * @param  string[]|null  $fields
     */
    private function addDimensionFields(
        Collection $dimensions,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns,
        bool $isSummary,
        ?array $fields
    ): void {
        $dimensions->each(function (SubsetDetailDimension $dimension) use (&$groupingColumns, &$selectColumns, &$orderColumns, $isSummary, $fields) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filter_only == 1) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($dimension->subset_column, $fields)) {
                return;
            }

            //if is summary then section info is included in as office_code, office_name
            if ($isSummary && $dimension->info->column === 'section_code') {
                return;
            }
            if ($dimension->column_expression != null) {
                $groupingColumns[] = $dimension->column_expression;
                $selectColumns[] = $dimension->column_expression . ' as `' . $dimension->subset_column . '`';
                if ($dimension->sort_order != null) {
                    $orderColumns[] = new SubsetFieldOrderInfo($dimension->column_expression, $dimension->sort_order);
                }

                return;
            }

            $groupingColumns[] = '`' . $dimension->info->column . '`';
            $selectColumns[] = $dimension->info->column . '_record.name as `' . $dimension->subset_column . '`';

            if ($dimension->sort_order != null) {
                $sortOrder = $dimension->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $dimension->info->column . '_record.name',
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }

    /**
     * @param  Collection<int, SubsetDetailMeasure>  $measures
     * @param  string[]  $measureColumns
     * @param  string[]  $groupingColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     */
    private function addMeasureFields(
        Collection $measures,
        array &$measureColumns,
        array &$groupingColumns,
        array &$orderColumns
    ): void {
        $measures->each(function (SubsetDetailMeasure $measure) use (&$measureColumns, &$groupingColumns, &$orderColumns) {
            if ($measure->info == null) {
                return;
            }
            if ($measure->info->unit_column != null) {
                $measureColumns[] = '`' . $measure->info->unit_column . '` as `' . $measure->subset_column . '`';
                $groupingColumns[] = '`' . $measure->info->unit_column . '`';
            }
            $column = '`' . $measure->info->column . '`';
            if ($measure->expression != null) {
                $column = $measure->expression;
            } elseif ($measure->aggregation != null) {
                //if weighted avg then use weight aggregation
                if ($measure->aggregation === 'WEIGHTED_AVG') {
                    if ($measure->weightInfo == null) {
                        return;
                    }
                    $column = 'SUM(' . $measure->info->column . ' * ' . $measure->weightInfo->column . ') / SUM('
                        . $measure->weightInfo->column . ')';
                } else {
                    $column = $measure->aggregation . '(' . $measure->info->column . ')';
                }
            }

            $measureColumns[] = $column . ' as `' . $measure->subset_column . '`';
            if ($measure->sort_order != null) {
                $sortOrder = $measure->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $column,
                    strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC'
                );
            }
        });
    }

    /**
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function includeHierarchy(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
        ?array $fields
    ): void {
        //if office info is included in the subset then include the hierarchy table
        $subsetDetail->dimensions->each(function ($dimension) use ($query, &$groupingColumns, &$selectColumns, $detail, $subsetDetail, $fields) {
            if ($dimension->hierarchy_id == null || $dimension->filter_only == 1) {
                return;
            }

            // Skip if fields is provided and this field is not in the list
            if ($fields !== null && ! in_array($dimension->subset_column, $fields)) {
                return;
            }

            $hierarchy = MetaHierarchy::where('id', $dimension->hierarchy_id)
                ->first();

            if ($hierarchy == null) {
                return;
            }
            $this->addHierarchyToQuery(
                $hierarchy,
                $query,
                $dimension,
                $detail,
                (int) $subsetDetail->group_data,
                $groupingColumns,
                $selectColumns,
            );
        });
    }

    /**
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function groupByDimension(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
        ?string $groupingLevel = null
    ): void {
        /** @var SubsetDetailDimension $dimensionRecord */
        $dimensionRecord = null;
        //find dimension with hierarchy
        foreach ($subsetDetail->dimensions as $dimension) {
            if ($dimension->hierarchy_id != null) {
                $dimensionRecord = $dimension;
            }
        }

        if ($dimensionRecord == null) {
            return;
        }

        $hierarchy = MetaHierarchy::where('id', $dimensionRecord->hierarchy_id)
            ->first();

        if ($hierarchy == null) {
            return;
        }

        $allLevelsInHierarchy = MetaHierarchyLevelInfo::where('meta_hierarchy_id', $dimensionRecord->hierarchy_id)
            ->orderBy('level')
            ->get();

        /** @var MetaHierarchyLevelInfo|null $selectedLevel */
        $selectedLevel = null;
        foreach ($allLevelsInHierarchy as $level) {
            if ($groupingLevel == null) {
                $selectedLevel = $level;
                break;
            }
            if (strtolower($level->name) === strtolower($groupingLevel)) {
                $selectedLevel = $level;
                break;
            }
        }

        if ($selectedLevel == null) {
            return;
        }
        $hierarchyBottomLevel = $allLevelsInHierarchy->max('level');

        $hierarchySubQuery = $this->flatten($hierarchy->id, $hierarchyBottomLevel);

        if ($selectedLevel->level === 1) {
            $query->leftJoinSub(
                $hierarchySubQuery,
                'hierarchy',
                function ($join) use ($detail, $dimensionRecord, $hierarchyBottomLevel) {
                    $join->on(
                        "$detail->table_name.$dimensionRecord->subset_column",
                        '=',
                        "hierarchy.lvl_{$hierarchyBottomLevel}_primary_field"
                    );
                }
            );
        } else {
            $query->joinSub(
                $hierarchySubQuery,
                'hierarchy',
                function ($join) use ($detail, $dimensionRecord, $hierarchyBottomLevel) {
                    $join->on(
                        "$detail->table_name.$dimensionRecord->subset_column",
                        '=',
                        "hierarchy.lvl_{$hierarchyBottomLevel}_primary_field"
                    );
                }
            );
        }

        $query->leftJoin(
            'meta_data as primary_field_record',
            "hierarchy.lvl_{$selectedLevel->level}_primary_field",
            '=',
            'primary_field_record.id'
        )
            ->leftJoin(
                'meta_data as secondary_field_record',
                "hierarchy.lvl_{$selectedLevel->level}_secondary_field",
                '=',
                'secondary_field_record.id'
            );

        $selectColumns[] = "primary_field_record.name as $hierarchy->primary_column";
        if ($subsetDetail->group_data == 1) {
            $groupingColumns[] = 'primary_field_record.name';
        }

        if ($hierarchy->secondary_column != null) {
            $selectColumns[] = "secondary_field_record.name as $hierarchy->secondary_column";
            if ($subsetDetail->group_data == 1) {
                $groupingColumns[] = 'secondary_field_record.name';
            }
        }
    }
}
