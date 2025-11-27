<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Models\NavigationBar\NavGroup;
use App\Models\NavigationBar\NavItem;
use Inertia\Inertia;

class NavEditorController extends Controller
{
    public function index()
    {
        $navData = NavGroup::with('navItems')->get();
        $defaultPage = NavItem::where('is_default', true)->first();

        return Inertia::render('NavEditor/NavEditorIndexPage', [
            'allNavData' => $navData,
            'defaultDashboardPageId' => $defaultPage?->id,
        ]);
    }
}
