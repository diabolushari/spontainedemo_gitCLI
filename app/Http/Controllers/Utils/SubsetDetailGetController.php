<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\JsonResponse;

class SubsetDetailGetController extends Controller
{
    public function __invoke(SubsetDetail $subsetDetail): JsonResponse
    {
        $subsetDetail->load([
            'dates.info',
            'dimensions.info',
            'dimensions.hierarchy',
            'measures.info',
            'measures.weightInfo',
        ]);

        return response()->json($subsetDetail);
    }
}
