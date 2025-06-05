<?php

namespace App\Http\Controllers\ChartData;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use Illuminate\Support\Facades\DB;

class ChartDataController extends Controller
{
    public function getDataDetails()
    {
        $data = DataDetail::select('id', 'name')
            ->where('is_active', 1)
            ->get();

        return response()->json($data);
    }

    public function getSubsetsByDataDetail($dataDetailId)
    {
        return SubsetDetail::select('id', 'name', 'description')
            ->where('data_detail_id', $dataDetailId)
            ->get();
    }
}
