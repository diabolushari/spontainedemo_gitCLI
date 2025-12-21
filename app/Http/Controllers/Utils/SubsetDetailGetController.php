<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\JsonResponse;

class SubsetDetailGetController extends Controller
{
    public function __invoke(SubsetDetail $subsetDetail): JsonResponse
    {
        return response()->json($subsetDetail);
    }
}
