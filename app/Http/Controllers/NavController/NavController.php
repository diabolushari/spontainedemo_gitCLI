<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Models\NavigationBar\NavGroup;

class NavController extends Controller
{
    public function __invoke()
    {
        $navData = NavGroup::with('navItems')->get();

        return response()->json($navData);
    }
}
