<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;


class SubsetDimensionFieldItemController extends Controller
{
    public function __invoke($subsetColumn, $subsetId, GetSubsetData $getSubsetData)
    {
        $subsetData = SubsetDetail::with('dimensions.info')->find($subsetId);
        $query = $getSubsetData
            ->setFilters(request()->all())
            ->withSubsetDetail($subsetData->id)
            ->getQuery();


        try {
            $categories = $query->pluck($subsetColumn)->unique()->values();
        } catch (\Exception $e) {
            return response()->json([]);
        }


        $formatted = $categories->map(function ($item) {
            return ['name' => $item];
        })->values();

        return response()->json($formatted);
    }
}
