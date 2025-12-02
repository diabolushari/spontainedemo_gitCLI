<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Http\Requests\NavRequest\StoreNavItemRequest;
use App\Http\Requests\NavRequest\UpdateNavItemRequest;
use App\Models\NavigationBar\NavItem;

class NavItemController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function store(StoreNavItemRequest $request)
    {
        $navItem = NavItem::create($request->validated());

        return redirect()->back()->with('success', 'Operation successful!');

    }

    public function update(UpdateNavItemRequest $request, NavItem $navItem)
    {
        $navItem->update($request->validated());

        return redirect()->back()->with('success', 'Operation successful!');

    }

    public function destroy(NavItem $navItem)
    {
        $navItem->delete();

        return redirect()->back()->with('success', 'Operation successful!');

    }
}
