<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;
use Mockery\Matcher\Subset;

class DataDetailSubsetGroupController extends Controller
{
    public function __invoke($dataDetailId)
    {
        // 1️⃣ Get all SubsetDetail IDs for the given dataDetailId
        $subsetIds = SubsetDetail::where('data_detail_id', $dataDetailId)
            ->pluck('id');

        // 2️⃣ Get all subset_group_id values from SubsetGroupItem
        $groupIds = SubsetGroupItem::whereIn('subset_detail_id', $subsetIds)
            ->pluck('subset_group_id')
            ->unique();

        // 3️⃣ Fetch all SubsetGroups using these IDs
        $groups = SubsetGroup::whereIn('id', $groupIds)->get();

        // 4️⃣ Return as JSON
        return response()->json($groups);
    }
}
