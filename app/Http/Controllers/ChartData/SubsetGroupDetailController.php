<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use Illuminate\Http\JsonResponse;

class SubsetGroupDetailController extends Controller
{
    public function __invoke($subsetGroupId): JsonResponse
    {
        $group = SubsetGroup::where('id', $subsetGroupId)
            ->firstOrFail();

        return response()->json($group);
    }
}
