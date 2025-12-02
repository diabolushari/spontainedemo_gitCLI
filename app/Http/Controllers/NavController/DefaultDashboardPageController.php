<?php

namespace App\Http\Controllers\NavController;

use App\Models\NavigationBar\NavItem;
use Illuminate\Support\Facades\DB;

class DefaultDashboardPageController
{
    public function __invoke(NavItem $navItem)
    {
        DB::transaction(function () use ($navItem) {

            NavItem::where('is_default', true)
                ->update(['is_default' => null]);

            $navItem->update(['is_default' => true]);
        });

        return redirect()->to('/nav-editor');
    }
}
