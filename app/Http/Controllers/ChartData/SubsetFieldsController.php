<?php

namespace App\Http\Controllers\ChartData;


use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;


class SubsetFieldsController extends Controller
{
    public function __invoke($dataDetailId)
    {
        $subset = SubsetDetail::with(['dates', 'dimensions', 'measures'])->find($dataDetailId);

        if (!$subset) {
            return response()->json(['error' => 'Not found'], 404);
        }


        $datesFields = collect($subset->dates)->pluck('field_name');
        $dimensionsFields = collect($subset->dimensions)->pluck('field_name');
        $measuresFields = collect($subset->measures)->pluck('field_name');

        $allFields = $datesFields->merge($dimensionsFields)->merge($measuresFields)->unique()->values();

        return response()->json($allFields);
    }
}
