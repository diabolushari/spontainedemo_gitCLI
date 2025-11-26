<?php

namespace App\Http\Controllers\NavController;

use App\Models\NavigationBar\NavItem;

class NavItemsListController
{
    public function __invoke()
    {
        $navItems = NavItem::all();

        return response()->json($navItems);
    }
}
