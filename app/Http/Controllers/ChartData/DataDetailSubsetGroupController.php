<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;

class DataDetailSubsetGroupController extends Controller
{
    public function __invoke($dataDetailId)
    {
        $subsetIds = SubsetDetail::where('data_detail_id', $dataDetailId)
            ->pluck('id');

        $groupIds = SubsetGroupItem::whereIn('subset_detail_id', $subsetIds)
            ->pluck('subset_group_id')
            ->unique();

        $groups = SubsetGroup::whereIn('id', $groupIds)
            ->get();

        return response()->json($groups);
    }
}
