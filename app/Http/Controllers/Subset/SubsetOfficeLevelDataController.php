<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;
use App\Services\Subset\SubsetFindMaxValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubsetOfficeLevelDataController extends Controller
{
    public function __invoke(
        SubsetDetail $subsetDetail,
        GetSubsetData $getSubsetData,
        SubsetFindMaxValue $findMaxValue,
        Request $request
    ): JsonResponse {

        $filters = $request->all();
        $latestValue = null;
        if ($request->filled('latest') && $request->filled($request->input('latest'))) {
            $maxValue = $findMaxValue->findMaxValue($subsetDetail, $request->input('latest'));
            if ($maxValue != null && $maxValue->max_value != null) {
                $filters[$request->input('latest')] = $maxValue->max_value;
                $latestValue = $maxValue->max_value;
            }
        }

        if ($subsetDetail->group_data == 0) {
            return response()->json();
        }

        $query = $getSubsetData
            ->setFilters($filters)
            ->withSummary(true)
            ->excludeNonMeasurements(false)
            ->withSummaryLevel($request->level ?? 'state')
            ->withSubsetDetail($subsetDetail->id)
            ->getQuery();

        $levelResult = $query?->get();

        return response()->json([
            'data' => $levelResult,
            'latest' => $latestValue,
        ]);
    }
}
