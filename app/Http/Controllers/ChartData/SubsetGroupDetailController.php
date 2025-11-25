<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;


class SubsetGroupDetailController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }
    public function __invoke($subsetGroupId): JsonResponse
    {
        $group = SubsetGroup::where('id', $subsetGroupId)
            ->firstOrFail();

        return response()->json($group);
    }
}
