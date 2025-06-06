<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DataDetailListController extends Controller
{
    public function getDataDetails()
    {
        return DB::table('data_details')
            ->select('id', 'name')
            ->where('is_active', 1)
            ->get();
    }
}
