<?php

namespace App\Services\User;

use Illuminate\Support\Collection;

class UserRoleService
{
    /**
     * @var Collection<int, array{
     *      role: string,
     *      superUser: bool,
     *      permissions: array<array-key, array{customRules: string[], permission: string}>
     *  }> $roles
     */
    private Collection $roles;

    public function __construct()
    {
        $this->roles = collect(RoleList::ROLES);
    }

    /**
     * @return array{
     *  role: string,
     *  superUser: bool,
     *  permissions:array<array-key, array{customRules: string[], permission: string}>
     * }|null
     */
    public function getRole(string $roleName): ?array
    {
        return $this->roles->where('role', $roleName)->first();
    }

    public function roleHasPermission(string $roleName, string $permission): bool
    {
        $role = $this->getRole($roleName);
        if ($role === null) {
            return false;
        }

        return $this->hasPermission($role, $permission);
    }

    /**
     * @return array<array-key, array{role: string}>
     */
    public function getRoleNames(): array
    {
        return $this->roles->map(function (array $role) {
            return [
                'role' => $role['role'],
            ];
        })->toArray();
    }

    /**
     * @param  array{
     *     role: string,
     *     superUser: bool,
     *     permissions: array<array-key, array{customRules: string[], permission: string}>
     * }  $role
     */
    private function hasPermission(array $role, string $permission): bool
    {
        if ($role['superUser']) {
            return true;
        }

        return collect($role['permissions'])->where('permission', $permission)->count() > 0;
    }
}
