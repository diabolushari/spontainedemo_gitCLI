<?php

namespace App\Http\Controllers\SampleChart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChartController extends Controller
{
    public function showLineChart(): Response
    {
        return Inertia::render('SampleChart/Chart');
    }
}
