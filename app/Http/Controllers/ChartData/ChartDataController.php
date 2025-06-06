<?php

namespace App\Http\Controllers\ChartData;


use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\SubsetGroup\SubsetGroup;


class ChartDataController extends Controller
{
    public function getDataDetails()
    {
        $data = DataDetail::select('id', 'name')
            ->where('is_active', 1)
            ->get();

        return response()->json($data);
    }

    public function getSubsetsByDataDetail($dataDetailId)
    {

        $subset = SubsetDetail::with(['dates', 'dimensions', 'measures'])->find($dataDetailId);

        $dateFields = $subset->dates->pluck('subset_field_name');
        $dimensionFields = $subset->dimensions->pluck('subset_field_name');
        $measureFields = $subset->measures->pluck('subset_field_name');

        $allFields = $dateFields
            ->merge($dimensionFields)
            ->merge($measureFields)
            ->unique()
            ->values()
            ->map(function ($field) {
                return ['field_name' => $field];
            });

        return response()->json($allFields);
    }

    public function getSubsetsGroups()
    {
        $data = SubsetGroup::select('id', 'name')->get();
        return response()->json($data);
    }

    public function getSubsetGroup($subsetId)
    {

        $group = SubsetGroup::findOrfail($subsetId);

        return response()->json($group->items);
    }
}
