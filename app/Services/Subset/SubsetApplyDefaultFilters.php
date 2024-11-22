<?php

namespace App\Services\Subset;

use App\Libs\GetRelativeTime;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

trait SubsetApplyDefaultFilters
{
    private function filterData(DataDetail $dataDetail, SubsetDetail $subsetDetail, Builder $builder): void
    {

        $subsetDetail->dates->each(function ($date) use ($builder, $dataDetail) {

            $getRelativeTime = new GetRelativeTime;

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
                    $relativeTime = $getRelativeTime->getRelativeTime(
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
                    $relativeTime = $getRelativeTime->getRelativeTime(
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
