<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\SubsetGroup\SubsetGroupItem;
use App\Models\Subset\SubsetDetail;

class SubsetGroupDetailedController extends Controller
{
    public function __invoke(int $group): JsonResponse
    {
        $subsetIds = SubsetGroupItem::where('subset_group_id', $group)
            ->pluck('subset_detail_id');

        $subsets = SubsetDetail::with('dimensions', 'measures')
            ->whereIn('id', $subsetIds)
            ->get();

        return response()->json($subsets);
    }
}
