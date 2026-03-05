<?php

namespace App\Models;

use App\Models\Subset\SubsetPermission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'group_name',
        'description',
    ];

    public function userGroupContexts()
    {
        return $this->hasMany(UserGroupContext::class, 'group_id', 'id');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(UserGroupPermission::class, 'group_id', 'id');
    }

    public function subsetPermission(): HasMany
    {
        return $this->hasMany(SubsetPermission::class, 'group_id', 'id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'group_id', 'id');
    }

    public function hierarchy(): HasOne
    {
        return $this->hasOne(UserGroupHierarchy::class, 'user_group_id', 'id');
    }
}
