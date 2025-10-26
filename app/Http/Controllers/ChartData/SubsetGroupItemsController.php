<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;

class SubsetGroupItemsController extends Controller
{
    public function __invoke($subsetGroupId)
    {
        $group = SubsetGroup::where('id', $subsetGroupId)
            ->with('items')
            ->firstOrFail();

        return response()->json($group->items);
    }
}
