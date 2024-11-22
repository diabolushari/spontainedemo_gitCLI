<?php

namespace App\Services\Subset;

use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Services\DataTable\JoinDataTable;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use App\Services\DistributionHierarchy\OfficeList;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\Builder;

readonly class SubsetQueryBuilder
{
    use GetHierarchyTableDetail;
    use SubsetApplyDefaultFilters;

    public function __construct(
        private JoinDataTable $joinDataTable,
        private OfficeList $officeList
    ) {}

    public function query(SubsetDetail $subsetDetail, bool $isSummary = false, string $summaryGroupBy = 'region'): Builder
    {

        /** @var string[] $groupingColumns */
        $groupingColumns = [];
        /** @var string[] $selectColumns */
        $selectColumns = [];
        /** @var string[] $measureColumns */
        $measureColumns = [];
        /** @var SubsetFieldOrderInfo[] $orderColumns */
        $orderColumns = [];

        if (! $isSummary) {
            $this->addDateFields($subsetDetail->dates, $groupingColumns, $selectColumns, $orderColumns);
            $this->addDimensionFields($subsetDetail->dimensions, $groupingColumns, $selectColumns, $orderColumns);
        }

        $this->addMeasureFields($subsetDetail->measures, $measureColumns, $groupingColumns, $orderColumns);

        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $subsetDetail->data_detail_id)
            ->first();

        $query = $this->joinDataTable->join($detail);

        if (! $isSummary) {
            $this->includeOfficeInfo(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns
            );
        }

        if ($isSummary) {
            $this->groupByOffice(
                $query,
                $subsetDetail,
                $detail,
                $groupingColumns,
                $selectColumns,
                $summaryGroupBy
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
            $query->orderByRaw($order->column.' '.$order->sortOrder);
        }

        return $query->selectRaw($selectStatement);

    }

    /**
     * @param  Collection<int, SubsetDetailDate>  $datesß
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     * @param  SubsetFieldOrderInfo[]  $orderColumns
     */
    private function addDateFields(
        Collection $dates,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns
    ): void {
        $dates->each(function (SubsetDetailDate $date) use (&$groupingColumns, &$selectColumns, &$orderColumns) {
            if ($date->info == null) {
                return;
            }
            if ($date->date_field_expression != null) {
                $column = $date->date_field_expression;
            } else {
                $column = '`'.$date->info->column.'`';
            }
            $groupingColumns[] = $column;
            $selectColumns[] = $column.' as `'.$date->subset_column.'`';
            if ($date->sort_order != null || request()->input('sort_by') === $date->subset_column) {
                $sortOrder = request()->filled('sort_order') ? request()->input('sort_order') : $date->sort_order;
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
     */
    private function addDimensionFields(
        Collection $dimensions,
        array &$groupingColumns,
        array &$selectColumns,
        array &$orderColumns
    ): void {
        $dimensions->each(function (SubsetDetailDimension $dimension) use (&$groupingColumns, &$selectColumns, &$orderColumns) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filter_only == 1) {
                return;
            }
            if ($dimension->column_expression != null) {
                $groupingColumns[] = $dimension->column_expression;
                $selectColumns[] = $dimension->column_expression.' as `'.$dimension->subset_column.'`';
                if ($dimension->sort_order != null) {
                    $orderColumns[] = new SubsetFieldOrderInfo($dimension->column_expression, $dimension->sort_order);
                }

                return;
            }

            $groupingColumns[] = '`'.$dimension->info->column.'`';
            $selectColumns[] = $dimension->info->column.'_record.name as `'.$dimension->subset_column.'`';

            if ($dimension->sort_order != null || request()->input('sort_by') === $dimension->subset_column) {
                $sortOrder = request()->filled('sort_order') ? request()->input('sort_order') : $dimension->sort_order;
                $orderColumns[] = new SubsetFieldOrderInfo(
                    $dimension->info->column.'_record.name',
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
                $measureColumns[] = '`'.$measure->info->unit_column.'` as `'.$measure->subset_column.'`';
                $groupingColumns[] = '`'.$measure->info->unit_column.'`';
            }
            $column = '`'.$measure->info->column.'`';
            if ($measure->expression != null) {
                $column = $measure->expression;
            } elseif ($measure->aggregation != null) {
                //if weighted avg then use weight aggregation
                if ($measure->aggregation === 'WEIGHTED_AVG') {
                    if ($measure->weightInfo == null) {
                        return;
                    }
                    $column = 'SUM('.$measure->info->column.' * '.$measure->weightInfo->column.') / SUM('
                        .$measure->weightInfo->column.')';
                } else {
                    $column = $measure->aggregation.'('.$measure->info->column.')';
                }
            }

            $measureColumns[] = $column.' as `'.$measure->subset_column.'`';
            if ($measure->sort_order != null || request()->input('sort_by') === $measure->subset_column) {
                $sortOrder = request()->filled('sort_order') ? request()->input('sort_order') : $measure->sort_order;
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
    private function includeOfficeInfo(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
    ): void {
        //if office info is included in the subset then include the hierarchy table
        $subsetDetail->dimensions->each(function ($dimension) use (&$groupingColumns, &$selectColumns, $subsetDetail, $detail, $query) {
            if ($dimension->info == null || $dimension->info->column !== 'section_code' || $dimension->filter_only === 1) {
                return;
            }
            $hierarchyTable = $this->getDetail();
            if ($hierarchyTable == null || $hierarchyTable->table_name === $detail->table_name) {
                return;
            }
            $hierarchyQuery = $this->officeList->get($hierarchyTable)
                ->selectRaw(
                    'section_name_record.name as section_name, '
                    .'section_code as hierarchy_section_code'
                );

            $query->leftJoinSub($hierarchyQuery, 'hierarchy', function ($join) use ($detail) {
                $join->on(
                    $detail->table_name.'.section_code',
                    '=',
                    'hierarchy.hierarchy_section_code'
                );
            });

            $selectColumns[] = 'hierarchy.section_name as section_name';

            if ($subsetDetail->group_data === 1) {
                $groupingColumns[] = 'hierarchy.section_name';
            }
        });
    }

    /**
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function groupByOffice(
        Builder $query,
        SubsetDetail $subsetDetail,
        DataDetail $detail,
        array &$groupingColumns,
        array &$selectColumns,
        string $groupBy = 'region_code'
    ): void {
        //if office info is included in the subset then include the hierarchy table
        $subsetDetail->dimensions->each(function ($dimension) use (&$groupingColumns, &$selectColumns, $subsetDetail, $detail, $query, $groupBy) {
            if ($dimension->info == null || $dimension->info->column !== 'section_code') {
                return;
            }
            $hierarchyTable = $this->getDetail();
            if ($hierarchyTable == null || $hierarchyTable->table_name === $detail->table_name) {
                return;
            }

            $joinSelect = 'region_code_record.name as region_code, region_name_record.name as region_name';
            $selectStatement = 'hierarchy.region_code as office_code';
            $nameSelectStatement = 'hierarchy.region_name as office_name';
            $groupingStatement = 'hierarchy.region_code';
            $nameGroupingStatement = 'hierarchy.region_name';

            if ($groupBy == 'circle') {
                $joinSelect = 'circle_code_record.name as circle_code, circle_name_record.name as circle_name';
                $selectStatement = 'hierarchy.circle_code as office_code';
                $groupingStatement = 'hierarchy.circle_code';
                $nameSelectStatement = 'hierarchy.circle_name as office_name';
                $nameGroupingStatement = 'hierarchy.circle_name';
            }

            if ($groupBy == 'division') {
                $joinSelect = 'division_code_record.name as division_code, division_name_record.name as division_name';
                $selectStatement = 'hierarchy.division_code as office_code';
                $groupingStatement = 'hierarchy.division_code';
                $nameSelectStatement = 'hierarchy.division_name as office_name';
                $nameGroupingStatement = 'hierarchy.division_name';
            }

            if ($groupBy == 'subdivision') {
                $joinSelect = 'subdivision_code_record.name as subdivision_code, subdivision_name_record.name as subdivision_name';
                $selectStatement = 'hierarchy.subdivision_code as office_code';
                $groupingStatement = 'hierarchy.subdivision_code';
                $nameSelectStatement = 'hierarchy.subdivision_name as office_name';
                $nameGroupingStatement = 'hierarchy.subdivision_name';
            }

            if ($groupBy == 'section') {
                $joinSelect = 'section_code_record.name as section_code, section_name_record.name as section_name';
                $selectStatement = 'hierarchy.section_code as office_code';
                $groupingStatement = 'hierarchy.section_code';
                $nameSelectStatement = 'hierarchy.section_name as office_name';
                $nameGroupingStatement = 'hierarchy.section_name';
            }

            $hierarchyQuery = $this->officeList->get($hierarchyTable)
                ->selectRaw(
                    'section_code as hierarchy_section_code, '
                    .$joinSelect
                );

            $query->joinSub($hierarchyQuery, 'hierarchy', function ($join) use ($detail) {
                $join->on(
                    $detail->table_name.'.section_code',
                    '=',
                    'hierarchy.hierarchy_section_code'
                );
            });

            $selectColumns[] = $selectStatement;
            $selectColumns[] = $nameSelectStatement;

            if ($subsetDetail->group_data === 1) {
                $groupingColumns[] = $groupingStatement;
                $groupingColumns[] = $nameGroupingStatement;
            }
        });
    }
}
