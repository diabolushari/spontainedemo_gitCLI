<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\JoinDataTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DataDetailDateController extends Controller
{
    public function __invoke(int $dataDetailId, Request $request, JoinDataTable $joinDataTable): JsonResponse
    {

        $field = $request->get('field', 'month_year');

        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields')
            ->where('id', $dataDetailId)
            ->first();

        $query = $joinDataTable->join($detail);

        $latestValue = $query
            ->selectRaw('MAX('.$field.'_record.name) as max_value')
            ->first();

        return response()->json($latestValue);
    }
}
