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

        return response()->json([
            'message' => 'Nav group created successfully.',
            'data' => $navItem,
        ], 201);
    }

    public function update(UpdateNavItemRequest $request, NavItem $navItem)
    {
        $navItem->update($request->validated());

        return response()->json([
            'message' => 'Nav item updated successfully.',
            'data' => $navItem,
        ]);
    }

    public function destroy(NavItem $navItem)
    {
        $navItem->delete();

        return response()->json([
            'message' => 'Nav item deleted successfully.',
        ]);
    }
}
