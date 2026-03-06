<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateUserGroupRequest;
use App\Models\Meta\MetaHierarchy;
use App\Models\UserGroup;
use App\Models\UserGroupHierarchy;
use App\Models\UserGroupPermission;
use App\Services\User\UserRoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ManageUserGroupController extends Controller
{
    public function index(Request $request): Response
    {
        $data = UserGroup::with('permissions', 'users')
            ->withCount('users')
            ->when($request->filled('search'), fn ($query) => $query->where('group_name', 'like', '%'.$request->search.'%'))
            ->paginate(20);

        return Inertia::render('UserGroup/UserGroupIndexPage', [
            'userGroups' => $data,
            'oldSearch' => $request->search ?? '',
        ]);
    }

    public function create(UserRoleService $userRoleService): Response
    {
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        return Inertia::render('UserGroup/CreateUserGroupPage', [
            'userRoles' => $userRoleService->getRoleNames(),
            'metaHierarchies' => $metaHierarchies,
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
            if ($data['meta_hierarchy_item_id']) {
                UserGroupHierarchy::create([
                    'user_group_id' => $record->id,
                    'meta_hierarchy_item_id' => $data['meta_hierarchy_item_id'],
                    'hierarchy_connection' => $data['hierarchy_connection'] ?? '',
                ]);
            }
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
            ->with('message', 'User group created successfully.');
    }

    public function show(UserGroup $userGroup): Response
    {
        $userGroup->load('permissions', 'users.organization', 'hierarchy.metaHierarchyItem.primaryField.metaStructure',
            'hierarchy.metaHierarchyItem.secondaryField', 'subsetPermission.subset');
// dd($userGroup);
        return Inertia::render('UserGroup/UserGroupShowPage', [
            'userGroup' => $userGroup,
        ]);
    }

    public function edit(UserGroup $userGroup, UserRoleService $userRoleService): Response
    {
        $userGroup->load('hierarchy.metaHierarchyItem.primaryField.metaStructure',
            'hierarchy.metaHierarchyItem.metaHierarchy', 'permissions');
        $metaHierarchies = MetaHierarchy::select('id', 'name')->get();

        return Inertia::render('UserGroup/CreateUserGroupPage', [
            'userRoles' => $userRoleService->getRoleNames(),
            'metaHierarchies' => $metaHierarchies,
            'userGroup' => $userGroup,
        ]);
    }

    public function update(UserGroup $userGroup, CreateUserGroupRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::beginTransaction();

        try {

            $userGroup->update([
                'group_name' => $data['group_name'],
                'description' => $data['description'],
            ]);

            if (! empty($data['meta_hierarchy_item_id'])) {

                UserGroupHierarchy::updateOrCreate(
                    ['user_group_id' => $userGroup->id],
                    [
                        'meta_hierarchy_item_id' => $data['meta_hierarchy_item_id'],
                        'hierarchy_connection' => $data['hierarchy_connection'] ?? '',
                    ]
                );

            } else {

                UserGroupHierarchy::where('user_group_id', $userGroup->id)->delete();
            }

            $existingRoleIds = [];
            $newRoles = [];

            foreach ($data['roles'] as $role) {

                if (is_numeric($role['id'])) {

                    $existingRoleIds[] = $role['id'];

                } else {

                    $newRoles[] = [
                        'group_id' => $userGroup->id,
                        'role' => $role['role'],
                        'created_at' => now(),
                    ];
                }
            }

            UserGroupPermission::where('group_id', $userGroup->id)
                ->whereNotIn('id', $existingRoleIds)
                ->delete();

            if (! empty($newRoles)) {
                UserGroupPermission::insert($newRoles);
            }

            DB::commit();

            return redirect()
                ->route('manage-user-group.index')
                ->with('success', 'User group updated successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    public function destroy(UserGroup $userGroup): RedirectResponse
    {
        try {
            $userGroup->delete();
        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()->route('manage-user-group.index')
            ->with('success', 'User group deleted successfully.');
    }
}
