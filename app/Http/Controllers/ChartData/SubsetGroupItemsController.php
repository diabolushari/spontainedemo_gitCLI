<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;

class SubsetGroupItemsController extends Controller
{
    public function __invoke($subsetGroupId)
    {
        $group = SubsetGroup::findOrFail($subsetGroupId);

        return response()->json($group->items);
    }
}
