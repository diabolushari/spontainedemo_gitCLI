<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetQueryBuilder;
use Illuminate\Http\JsonResponse;
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

    public function __invoke(SubsetDetail $subsetDetail, SubsetQueryBuilder $queryBuilder): JsonResponse
    {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        if ($subsetDetail->group_data === 0) {
            return response()->json();
        }

        $region = $queryBuilder->query($subsetDetail, true, 'region')->get();
        $circle = $queryBuilder->query($subsetDetail, true, 'circle')->get();
        $division = $queryBuilder->query($subsetDetail, true, 'division')->get();
        $subdivision = $queryBuilder->query($subsetDetail, true, 'subdivision')->get();
        $section = $queryBuilder->query($subsetDetail, true, 'section')->get();

        return response()->json([
            ...$region,
            ...$circle,
            ...$division,
            ...$subdivision,
            ...$section,
        ]);

    }
}
