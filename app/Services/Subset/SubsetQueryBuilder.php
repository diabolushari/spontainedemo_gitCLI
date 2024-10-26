<?php

namespace App\Services\Subset;

use App\Libs\GetRelativeTime;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Services\DataTable\JoinDataTable;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

readonly class SubsetQueryBuilder
{
    public function __construct(
        private JoinDataTable $joinDataTable,
        private GetRelativeTime $getRelativeTime
    ) {}

    public function query(SubsetDetail $subsetDetail): Builder
    {

        /** @var string[] $groupingColumns */
        $groupingColumns = [];
        /** @var string[] $selectColumns */
        $selectColumns = [];
        /** @var string[] $measureColumns */
        $measureColumns = [];

        $subsetDetail->dates->each(function ($date) use (&$groupingColumns, &$selectColumns) {
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

        $subsetDetail->dimensions->each(function ($dimension) use (&$groupingColumns, &$selectColumns) {
            if ($dimension->info == null) {
                return;
            }
            if ($dimension->filter_only === 1) {
                return;
            }
            if ($dimension->column_expression != null) {
                $groupingColumns[] = $dimension->column_expression;
                $selectColumns[] = $dimension->column_expression.' as '.$dimension->info->column;
            } else {
                $groupingColumns[] = $dimension->info->column;
                $selectColumns[] = $dimension->info->column.'_record.name as '.$dimension->info->column;
            }
        });

        $subsetDetail->measures->each(function ($measure) use (&$measureColumns, &$groupingColumns) {
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
                if ($measure->weightInfo == null) {
                    return;
                }
                //if weighted avg then use weight aggregation
                if ($measure->aggregation === 'WEIGHTED_AVG') {
                    $measureColumns[] = 'SUM('.$measure->info->column.' * '.$measure->weightInfo->column.') / SUM('
                        .$measure->weightInfo->column.') as '.$measure->info->column;

                    return;
                }
                $measureColumns[] = $measure->aggregation.'('.$measure->info->column.') as '.$measure->info->column;
            } else {
                $measureColumns[] = $measure->info->column;
            }

        });

        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $subsetDetail->data_detail_id)
            ->first();

        $query = $this->joinDataTable->join($detail);

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
