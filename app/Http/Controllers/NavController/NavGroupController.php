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
        NavGroup::create($request->validated());

        return redirect()->back()->with('success', 'Operation successful!');
    }

    public function update(UpdateNavGroupRequest $request, NavGroup $navGroup)
    {
        $navGroup->update($request->validated());

        return redirect()->back()->with('success', 'Operation successful!');
    }

    public function destroy(NavGroup $navGroup)
    {
        $navGroup->delete();

        return redirect()->back()->with('success', 'Operation successful!');

    }
}
