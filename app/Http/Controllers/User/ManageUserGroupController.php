<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserGroupRequest;
use App\Models\ReferenceData\ReferenceData;
use App\Models\UserGroup;
use App\Models\UserGroupPermission;
use App\Services\User\UserRoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class ManageUserGroupController extends Controller
{

    public function index(Request $request): Response
    {
        $data = UserGroup::with('permissions')
            ->when($request->filled('search'), fn($query) => $query->where('group_name', 'like', '%' . $request->search . '%'))
            ->paginate(20);

        return Inertia::render('UserGroup/UserGroupIndexPage', [
            'userGroups' => $data,
            'oldSearch' => $request->search ?? '',
        ]);
    }
    public function create(UserRoleService $userRoleService): Response
    {

        return Inertia::render('UserGroup/CreateUserGroupPage', [
            'userRoles' => $userRoleService->getRoleNames(),
        ]);
    }

    public function store(CreateUserGroupRequest $request): RedirectResponse
    {

        $data = $request->validated();

        $rolesUpload = [];

        try {
            $record = UserGroup::create([
                'group_name' => $data['group_name'],
                'description' => $data['description'],
            ]);

            foreach ($data['roles'] as $role) {
                $rolesUpload[] = [
                    'group_id' => $record->id,
                    'role' => $role['role'],
                    'created_at' => now(),
                ];
            }

            UserGroupPermission::insert($rolesUpload);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('manage-user-group.index')
            ->with('success', 'User group created successfully.');
    }

    public function show(UserGroup $userGroup): Response
    {
        $userGroup->load('permissions','users');

        return Inertia::render('UserGroup/UserGroupShowPage', [
            'userGroup' => $userGroup,
        ]);
    }
}
