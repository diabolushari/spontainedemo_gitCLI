<?php

namespace App\Services\DataTable;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

readonly class QueryDataTable
{
    public function query(string $table, int $dataDetailId): Builder
    {
        return DB::table($table)
            ->where('data_detail_id', $dataDetailId)
            ->leftJoin('meta_data as dim_1_record', "$table.dim_1", '=', 'dim_1_record.id')
            ->leftJoin('meta_data as dim_2_record', "$table.dim_2", '=', 'dim_2_record.id')
            ->leftJoin('meta_data as dim_3_record', "$table.dim_3", '=', 'dim_3_record.id')
            ->leftJoin('meta_data as dim_4_record', "$table.dim_4", '=', 'dim_4_record.id')
            ->leftJoin('meta_data as dim_5_record', "$table.dim_5", '=', 'dim_5_record.id')
            ->leftJoin('meta_data as dim_6_record', "$table.dim_6", '=', 'dim_6_record.id')
            ->leftJoin('meta_data as dim_7_record', "$table.dim_7", '=', 'dim_7_record.id')
            ->leftJoin('meta_data as dim_8_record', "$table.dim_8", '=', 'dim_8_record.id')
            ->leftJoin('meta_data as dim_9_record', "$table.dim_9", '=', 'dim_9_record.id')
            ->leftJoin('meta_data as dim_10_record', "$table.dim_10", '=', 'dim_10_record.id')
            ->selectRaw("
                $table.*,
                dim_1_record.name as dim_1_name,
                dim_2_record.name as dim_2_name,
                dim_3_record.name as dim_3_name,
                dim_4_record.name as dim_4_name,
                dim_5_record.name as dim_5_name,
                dim_6_record.name as dim_6_name,
                dim_7_record.name as dim_7_name,
                dim_8_record.name as dim_8_name,
                dim_9_record.name as dim_9_name,
                dim_10_record.name as dim_10_name
            ");
    }
}
