<?php

namespace App\Http\Controllers\NavController;

use App\Http\Controllers\Controller;
use App\Http\Requests\NavRequest\StoreNavGroupRequest;
use App\Http\Requests\NavRequest\UpdateNavGroupRequest;
use App\Models\NavigationBar\NavGroup;

class NavGroupController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function store(StoreNavGroupRequest $request)
    {
        $navGroup = NavGroup::create($request->validated());

        return response()->json([
            'message' => 'Nav group created successfully.',
            'data' => $navGroup,
        ], 201);
    }

    public function update(UpdateNavGroupRequest $request, NavGroup $navGroup)
    {
        $navGroup->update($request->validated());

        return response()->json([
            'message' => 'Nav item updated successfully.',
            'data' => $navGroup,
        ]);
    }

    public function destroy(NavGroup $navGroup)
    {
        $navGroup->delete();

        return response()->json([
            'message' => 'Nav group deleted successfully.',
        ]);
    }
}
