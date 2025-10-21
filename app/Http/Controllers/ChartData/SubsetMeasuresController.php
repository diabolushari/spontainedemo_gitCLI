<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubsetMeasuresController extends Controller
{
    public function __invoke(Request $request, $subsetId): JsonResponse
    {

        $subset = SubsetDetail::with('measures')
            ->where('id', $subsetId)
            ->first();

        if ($subset == null) {
            return response()->json();
        }

        $measures = $subset->measures->map(function ($measure) {
            return [
                'subset_field_name' => $measure->subset_field_name,
                'subset_column' => $measure->subset_column,
            ];
        });

        return response()->json($measures);
    }
}
