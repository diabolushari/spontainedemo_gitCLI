<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;

class SubsetGroupListController extends Controller
{
    public function __invoke()
    {
        $data = SubsetGroup::select('id', 'name')->get();

        return response()->json($data);
    }
}
