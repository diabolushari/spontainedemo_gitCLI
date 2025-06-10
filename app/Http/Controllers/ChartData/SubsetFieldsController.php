<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;

class SubsetFieldsController extends Controller
{
    public function __invoke($subsetId)
    {
        $subset = SubsetDetail::with(['dates', 'dimensions', 'measures'])
            ->where('id', $subsetId)
            ->first();

        if (! $subset) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json($subset);
    }
}
