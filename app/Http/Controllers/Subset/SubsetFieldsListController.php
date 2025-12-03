<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubsetFieldsListController extends Controller
{
    /**
     * @return string[]
     */


    public function __invoke(Request $request): JsonResponse
    {
        $dates = SubsetDetailDate::where('subset_detail_id', $request->subset_id)->get();
        $dimensions = SubsetDetailDimension::where('subset_detail_id', $request->subset_id)->get();
        $measures = SubsetDetailMeasure::where('subset_detail_id', $request->subset_id)->get();

        return response()->json([
            'dates' => $dates,
            'dimensions' => $dimensions,
            'measures' => $measures,
        ]);

    }
}
