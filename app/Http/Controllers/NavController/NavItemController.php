<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Http\Requests\NavRequest\StoreNavItemRequest;
use App\Models\NavigationBar\NavItem;

class NavItemController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function create(StoreNavItemRequest $request)
    {
        $navItem = NavItem::create($request->validated());

        return response()->json([
            'message' => 'Nav group created successfully.',
            'data' => $navItem,
        ], 201);
    }

    public function destroy(NavItem $navItem)
    {
        dd($navItem);
    }
}
