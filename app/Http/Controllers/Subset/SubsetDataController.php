<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetFindMaxValue;
use App\Services\Subset\SubsetQueryBuilder;
use App\Services\Subset\SubsetQuerySorting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetDataController extends Controller implements HasMiddleware
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
        SubsetQuerySorting $querySorting,
        Request $request,
    ): JsonResponse {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        $query = $queryBuilder->query($subsetDetail);

        $filters = $request->all();
        $latestValue = null;
        if ($request->filled('latest')) {
            $maxValue = $findMaxValue->findMaxValue($subsetDetail, $request->input('latest'));
            if ($maxValue != null && $maxValue->max_value != null) {
                $filters[$request->input('latest')] = $maxValue->max_value;
                $latestValue = $maxValue->max_value;
            }
        }

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            $filters
        );

        if ($request->filled('sort_by')) {
            $querySorting->addSort(
                $query,
                $subsetDetail,
                false,
                $request->input('sort_by'),
                $request->input('sort_order', 'ASC'),
            );
        }

        if ($request->filled('secondary_sort_by')) {
            $querySorting->addSort(
                $query,
                $subsetDetail,
                false,
                $request->input('secondary_sort_by'),
                $request->input('secondary_sort_order', 'ASC'),
            );
        }

        return response()->json([
            'data' => $query->get(),
            'latest_value' => $latestValue,
        ]);

    }
}
