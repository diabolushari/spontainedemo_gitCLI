<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Models\SubsetGroup\SubsetGroupItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

final class SubsetHavingDimensionMeasureController extends Controller implements HasMiddleware
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

    public function __invoke(int $group): JsonResponse
    {
        $subsetIds = SubsetGroupItem::where('subset_group_id', $group)
            ->pluck('subset_detail_id');

        $subsets = SubsetDetail::whereIn('id', $subsetIds)
            ->where(function ($query) {
                $query->whereHas('dimensions')
                    ->orWhereHas('dates');
            })
            ->whereHas('measures')
            ->get();

        return response()->json($subsets);
    }
}
