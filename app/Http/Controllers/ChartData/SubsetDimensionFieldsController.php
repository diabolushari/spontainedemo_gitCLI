<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\JsonResponse;

class SubsetDimensionFieldsController extends Controller
{
    public function __invoke($subsetId): JsonResponse
    {
        $subset = SubsetDetail::with([
            'dimensions' => function ($query) {
                $query->where('filter_only', 0);
            }
        ])->where('id', $subsetId)
            ->first();

        if ($subset == null) {
            return response()->json();
        }

        $dimensions = $subset->dimensions->map(function ($dimension) {
            return [
                'id' => $dimension->id,
                'subset_field_name' => $dimension->subset_field_name,
                'subset_column' => $dimension->subset_column,
                'hierarchy_id' => $dimension->hierarchy_id,
            ];
        });

        return response()->json($dimensions);
    }
}
