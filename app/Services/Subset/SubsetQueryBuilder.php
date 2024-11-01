<?php

namespace App\Services\Subset;

use App\Libs\GetRelativeTime;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Services\DataTable\JoinDataTable;
use App\Services\DistributionHierarchy\GetHierarchyTableDetail;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

readonly class SubsetQueryBuilder
{
    use GetHierarchyTableDetail;

    public function __construct(
        private JoinDataTable $joinDataTable,
        private GetRelativeTime $getRelativeTime
    ) {}

    public function query(SubsetDetail $subsetDetail, bool $isSummary = false, string $summaryGroupBy = 'region'): Builder
    {

        /** @var string[] $groupingColumns */
        $groupingColumns = [];
        /** @var string[] $selectColumns */
        $selectColumns = [];
        /** @var string[] $measureColumns */
        $measureColumns = [];

        if (! $isSummary) {
            $this->addDateFields($subsetDetail->dates, $groupingColumns, $selectColumns);
            $this->addDimensionFields($subsetDetail->dimensions, $groupingColumns, $selectColumns);
        }

        $this->addMeasureFields($subsetDetail->measures, $measureColumns, $groupingColumns);

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

        if ($subsetDetail->group_data === 1 && count($groupingColumns) > 0) {
            $groupByStatement = implode(',', $groupingColumns);
            $query->groupByRaw($groupByStatement);
        }

        $this->filterData($detail, $subsetDetail, $query);

        return $query->selectRaw($selectStatement);

    }

    /**
     * @param  Collection<int, SubsetDetailDate>  $dates
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function addDateFields(
        Collection $dates,
        array &$groupingColumns,
        array &$selectColumns
    ): void {
        $dates->each(function ($date) use (&$groupingColumns, &$selectColumns) {
            if ($date->info == null) {
                return;
            }
            if ($date->date_field_expression != null) {
                $groupingColumns[] = $date->date_field_expression;
                $selectColumns[] = $date->date_field_expression.' as '.$date->info->column;
            } else {
                $groupingColumns[] = $date->info->column;
                $selectColumns[] = $date->info->column;
            }
        });
    }

    /**
     * @param  Collection<int, SubsetDetailDimension>  $dimensions
     * @param  string[]  $groupingColumns
     * @param  string[]  $selectColumns
     */
    private function addDimensionFields(
        Collection $dimensions,
        array &$groupingColumns,
        array &$selectColumns
    ): void {
        $dimensions->each(function ($dimension) use (&$groupingColumns, &$selectColumns) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filter_only === 1) {
                return;
            }
            if ($dimension->column_expression != null) {
                $groupingColumns[] = $dimension->column_expression;
                $selectColumns[] = $dimension->column_expression.' as '.$dimension->info->column;

                return;
            }

            $groupingColumns[] = $dimension->info->column;
            $selectColumns[] = $dimension->info->column.'_record.name as '.$dimension->info->column;
        });
    }

    /**
     * @param  Collection<int, SubsetDetailMeasure>  $measures
     * @param  string[]  $measureColumns
     * @param  string[]  $groupingColumns
     */
    private function addMeasureFields(
        Collection $measures,
        array &$measureColumns,
        array &$groupingColumns
    ): void {
        $measures->each(function ($measure) use (&$measureColumns, &$groupingColumns) {
            if ($measure->info == null) {
                return;
            }
            if ($measure->info->unit_column != null) {
                $measureColumns[] = $measure->info->unit_column;
                $groupingColumns[] = $measure->info->unit_column;
            }
            if ($measure->expression != null) {
                $measureColumns[] = $measure->expression.' as '.$measure->info->column;

                return;
            }
            if ($measure->aggregation != null) {
                //if weighted avg then use weight aggregation
                if ($measure->aggregation === 'WEIGHTED_AVG') {
                    if ($measure->weightInfo == null) {
                        return;
                    }
                    $measureColumns[] = 'SUM('.$measure->info->column.' * '.$measure->weightInfo->column.') / SUM('
                        .$measure->weightInfo->column.') as '.$measure->info->column;

                    return;
                }
                $measureColumns[] = $measure->aggregation.'('.$measure->info->column.') as '.$measure->info->column;
            } else {
                $measureColumns[] = $measure->info->column;
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
            if ($dimension->info == null || $dimension->info->column !== 'section_code') {
                return;
            }
            $hierarchyTable = $this->getDetail();
            if ($hierarchyTable == null || $hierarchyTable->table_name === $detail->table_name) {
                return;
            }
            $hierarchyQuery = $this->joinDataTable->join($hierarchyTable)
                ->selectRaw(
                    'section_name_record.name as section_name, '
                    .'section_code as hierarchy_section_code, '
                    .'region_code_record.name as region_code, '
                    .'region_name_record.name as region_name, '
                    .'circle_code_record.name as circle_code, '
                    .'circle_name_record.name as circle_name, '
                    .'division_code_record.name as division_code, '
                    .'division_name_record.name as division_name, '
                    .'subdivision_code_record.name as subdivision_code,'
                    .'subdivision_name_record.name as subdivision_name'
                );

            $query->joinSub($hierarchyQuery, 'hierarchy', function ($join) use ($detail) {
                $join->on(
                    $detail->table_name.'.section_code',
                    '=',
                    'hierarchy.hierarchy_section_code'
                );
            });

            $selectColumns[] = 'hierarchy.section_name as section_name';
            $selectColumns[] = 'hierarchy.region_code as region_code';
            $selectColumns[] = 'hierarchy.region_name as region_name';
            $selectColumns[] = 'hierarchy.circle_code as circle_code';
            $selectColumns[] = 'hierarchy.circle_name as circle_name';
            $selectColumns[] = 'hierarchy.division_code as division_code';
            $selectColumns[] = 'hierarchy.division_name as division_name';
            $selectColumns[] = 'hierarchy.subdivision_code as subdivision_code';
            $selectColumns[] = 'hierarchy.subdivision_name as subdivision_name';
            if ($subsetDetail->group_data === 1) {
                $groupingColumns[] = 'hierarchy.section_name';
                $groupingColumns[] = 'hierarchy.region_code';
                $groupingColumns[] = 'hierarchy.region_name';
                $groupingColumns[] = 'hierarchy.circle_code';
                $groupingColumns[] = 'hierarchy.circle_name';
                $groupingColumns[] = 'hierarchy.division_code';
                $groupingColumns[] = 'hierarchy.division_name';
                $groupingColumns[] = 'hierarchy.subdivision_code';
                $groupingColumns[] = 'hierarchy.subdivision_name';
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

            $joinSelect = 'region_code_record.name as region_code';
            $selectStatement = 'hierarchy.region_code as office_code';
            $groupingStatement = 'hierarchy.region_code';

            if ($groupBy == 'circle') {
                $joinSelect = 'circle_code_record.name as circle_code';
                $selectStatement = 'hierarchy.circle_code as circle_code';
                $groupingStatement = 'hierarchy.circle_code';
            }

            if ($groupBy == 'division') {
                $joinSelect = 'division_code_record.name as division_code';
                $selectStatement = 'hierarchy.division_code as division_code';
                $groupingStatement = 'hierarchy.division_code';
            }

            if ($groupBy == 'subdivision') {
                $joinSelect = 'subdivision_code_record.name as subdivision_code';
                $selectStatement = 'hierarchy.subdivision_code as subdivision_code';
                $groupingStatement = 'hierarchy.subdivision_code';
            }

            $hierarchyQuery = $this->joinDataTable->join($hierarchyTable)
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

            if ($subsetDetail->group_data === 1) {
                $groupingColumns[] = $groupingStatement;
            }
        });
    }

    private function filterData(DataDetail $dataDetail, SubsetDetail $subsetDetail, Builder $builder): void
    {

        $subsetDetail->dates->each(function ($date) use ($builder, $dataDetail) {
            if ($date->info == null) {
                return;
            }
            if ($date->use_dynamic_date !== 1) {
                if ($date->start_date != null) {
                    $builder->where($date->info->column, '>=', $date->start_date);
                }
                if ($date->end_date != null) {
                    $builder->where($date->info->column, '<=', $date->end_date);
                }
            }
            if ($date->use_dynamic_date === 1) {
                if ($date->dynamic_start_type !== null && $date->dynamic_start_offset !== null && $date->dynamic_start_unit !== null) {
                    $relativeTime = $this->getRelativeTime->getRelativeTime(
                        $date->dynamic_start_type,
                        $date->dynamic_start_offset,
                        $date->dynamic_start_unit
                    );
                    if ($date->use_last_found_data === 1) {
                        $lastFound = DB::table($dataDetail->table_name)
                            ->where($date->info->column, '<=', $relativeTime)
                            ->max($date->info->column);

                        if ($lastFound != null) {
                            $relativeTime = $lastFound;
                        }
                    }
                    if ($relativeTime != null) {
                        $builder->where($date->info->column, '>=', $relativeTime);
                    }
                }
                if ($date->dynamic_end_type !== null && $date->dynamic_end_offset !== null && $date->dynamic_end_unit !== null) {
                    $relativeTime = $this->getRelativeTime->getRelativeTime(
                        $date->dynamic_end_type,
                        $date->dynamic_end_offset,
                        $date->dynamic_end_unit
                    );
                    if ($relativeTime != null) {
                        $builder->where($date->info->column, '<=', $relativeTime);
                    }
                }
            }
        });

        $subsetDetail->dimensions->each(function ($dimension) use ($builder) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filters != null && count($dimension->filters) > 0) {
                $builder->whereIn($dimension->info->column, $dimension->filters);
            }
        });

    }
}
