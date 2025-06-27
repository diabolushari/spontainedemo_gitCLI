<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;

class SubsetDimensionFieldsController extends Controller
{
    public function __invoke($subsetId)
    {
        $subset = SubsetDetail::with(['dimensions' => function ($query) {
            $query->where('filter_only', 0);
        }])->find($subsetId);
        $dimensions = $subset->dimensions->map(function ($dimension) {
            return [
                'id' => $dimension->id,
                'subset_field_name' => $dimension->subset_field_name,
                'subset_column' => $dimension->subset_column,
            ];
        });
        return response()->json($dimensions);
    }
}
