<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetQueryBuilder;
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
        Request $request
    ): JsonResponse {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        $filterParams = $request->all();

        if ($subsetDetail->group_data == 0) {
            return response()->json();
        }

        $query = $queryBuilder->query(
            $subsetDetail,
            true,
            $request->level ?? 'region'
        );

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            $filterParams
        );

        $levelResult = $query->paginate(5)->withQueryString();

        return response()->json([
            'data' => $levelResult,
        ]);
    }
}
