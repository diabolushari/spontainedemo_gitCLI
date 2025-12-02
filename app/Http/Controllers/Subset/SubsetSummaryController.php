<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Libs\ArrayPagination;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;
use App\Services\Subset\SubsetFindMaxValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubsetSummaryController extends Controller
{
    public function __invoke(
        SubsetDetail $subsetDetail,
        GetSubsetData $getSubsetData,
        SubsetFindMaxValue $findMaxValue,
        Request $request
    ): JsonResponse {

        $filterParams = $request->all();
        $latestValue = null;
        if (!$request->filled('month')) {
            $maxValue = $findMaxValue->findMaxValue($subsetDetail, 'month');
            if ($maxValue != null && $maxValue->max_value != null) {
                $filterParams['month'] = $maxValue->max_value;
                $latestValue = $maxValue->max_value;
            }
        }

        if ($subsetDetail->group_data == 0) {
            return response()->json();
        }

        $query = $getSubsetData
            ->setFilters($filterParams)
            ->withSummary(true)
            ->excludeNonMeasurements(true)
            ->withSummaryLevel($request->level ?? 'region')
            ->withDimension($request->dimension)
            ->withSubsetDetail($subsetDetail->id)
            ->getQuery();

        $levelResult = $query?->get()->toArray();

        return response()->json([
            'data' => (new ArrayPagination($levelResult, $request->per_page ?? 5))->paginate(),
            'latest_value' => $latestValue,
        ]);
    }
}
