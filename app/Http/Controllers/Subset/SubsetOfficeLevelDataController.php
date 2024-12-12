<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetFindMaxValue;
use App\Services\Subset\SubsetQueryBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetOfficeLevelDataController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetQueryBuilder $queryBuilder,
        SubsetFilterBuilder $filterBuilder,
        SubsetFindMaxValue $findMaxValue,
        Request $request
    ): JsonResponse {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

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

        $query = $queryBuilder->query(
            $subsetDetail,
            true,
            false,
            $request->level ?? 'state'
        );

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            $filters
        );

        $levelResult = $query->get();

        return response()->json([
            'data' => $levelResult,
            'latest' => $latestValue,
        ]);
    }
}
