<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Http\Requests\NavRequest\StoreNavGroupRequest;
use App\Models\NavigationBar\NavGroup;

class NavGroupController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function create(StoreNavGroupRequest $request)
    {
        $navGroup = NavGroup::create($request->validated());

        return response()->json([
            'message' => 'Nav group created successfully.',
            'data' => $navGroup,
        ], 201);
    }
}
