<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\Request;

class SubsetFieldsController extends Controller
{
    public function __invoke(Request $request, $subsetId)
    {
        

        $subset = SubsetDetail::with('measures')
            ->find($subsetId);
        $measures = $subset->measures->map(function ($measure) {
            return [
                'subset_field_name' => $measure->subset_field_name,
                'subset_column' => $measure->subset_column,
            ];
        });

        if (! $subset) {
            return response()->json(['error' => 'Not found'], 404);
        }



        return response()->json($measures);
    }
}
