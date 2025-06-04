<?php

namespace App\Http\Controllers\ChartData;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ChartDataController extends Controller
{
    public function getDataDetails()
    {
        return DB::table('data_details')->select('id', 'name')->where('is_active', 1)->get();
    }

    public function getSubsetsByDataDetail($dataDetailId)
    {
        return DB::table('subset_details')
            ->select('id', 'name', 'description')
            ->where('data_detail_id', $dataDetailId)
            ->get();
    }
}
