<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;

class SubsetGroupNameController extends Controller
{
    public function __invoke($id)
    {
        $data = SubsetGroup::with('items')
            ->where('id', $id)
            ->first();
        return response($data);
    }
}
