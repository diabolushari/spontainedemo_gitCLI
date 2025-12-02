<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Models\NavigationBar\NavItem;

class DefaultDashboardPageGetController extends Controller
{
    public function __invoke(
    ) {
        $navItem = NavItem::where('is_default', true)->firstOrFail();

        return redirect($navItem->item_url);

    }
}
