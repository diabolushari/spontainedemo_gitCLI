<?php

namespace App\Http\Controllers;


use Inertia\Inertia;

class TabController extends Controller
{
    public function show()
    {
        return Inertia::render('AnalyticsDashboard/tab');
    }
}
