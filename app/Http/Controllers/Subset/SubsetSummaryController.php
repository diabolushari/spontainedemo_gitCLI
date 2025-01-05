<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Libs\ArrayPagination;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetFindMaxValue;
use App\Services\Subset\SubsetQueryBuilder;
use App\Services\Subset\SubsetQuerySorting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetSummaryController extends Controller implements HasMiddleware
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
        Request $request
    ): JsonResponse {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        $filterParams = $request->all();
        $latestValue = null;
        if (! $request->filled('month')) {
            $maxValue = $findMaxValue->findMaxValue($subsetDetail, 'month');
            if ($maxValue != null && $maxValue->max_value != null) {
                $filterParams['month'] = $maxValue->max_value;
                $latestValue = $maxValue->max_value;
            }
        }

        if ($subsetDetail->group_data == 0) {
            return response()->json();
        }

        $query = $queryBuilder->query(
            $subsetDetail,
            true,
            true,
            $request->level ?? 'region'
        );

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            $filterParams
        );

        if ($request->filled('sort_by')) {
            $querySorting->addSort(
                $query,
                $subsetDetail,
                true,
                $request->input('sort_by'),
                $request->input('sort_order', 'ASC'),
            );
        }

        if ($request->filled('secondary_sort_by')) {
            $querySorting->addSort(
                $query,
                $subsetDetail,
                true,
                $request->input('secondary_sort_by'),
                $request->input('secondary_sort_order', 'ASC'),
            );
        }

        $levelResult = $query->get()->toArray();

        return response()->json([
            'data' => (new ArrayPagination($levelResult, $request->per_page ?? 5))->paginate(),
            'latest_value' => $latestValue,
        ]);
    }
}
