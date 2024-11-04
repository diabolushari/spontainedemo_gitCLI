<?php

namespace App\Services\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

readonly class QueryDataTable
{
    public function query(DataDetail $dataDetail): Builder
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

        $selectDimensions = '';
        foreach ($dataDetail->dimensionFields as $dimension) {
            $selectDimensions .= ', '.$dimension->column.'_record.name as `'.$dimension->column.'`';
        }

        return $query->selectRaw("$tableName.* $selectDimensions");
    }
}
