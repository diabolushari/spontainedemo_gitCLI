<?php

namespace App\Services\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class JoinDataTable
{
    public function join(DataDetail $dataDetail): Builder
    {

        $tableName = $dataDetail->table_name;

        $query = DB::table($tableName);

        foreach ($dataDetail->dimensionFields as $dimension) {
            $query->leftJoin(
                'meta_data as '.$dimension->column.'_record',
                "$tableName.$dimension->column",
                '=',
                $dimension->column.'_record.id'
            );
        }

        return $query;

    }
}
