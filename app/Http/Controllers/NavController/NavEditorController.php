<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Models\NavigationBar\NavGroup;
use Inertia\Inertia;

class NavEditorController extends Controller
{
    public function index()
    {
        $navData = NavGroup::with('navItems')->get();

        return Inertia::render('NavEditor/NavEditorIndexPage', [
            'allNavData' => $navData,
        ]);
    }
}
