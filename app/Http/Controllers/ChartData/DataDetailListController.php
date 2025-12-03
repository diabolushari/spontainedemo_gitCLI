<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;

class DataDetailListController extends Controller
{
    public function __invoke()
    {
        return DataDetail::select('id', 'name', 'description')
            ->where('is_active', 1)
            ->get();
    }
}
