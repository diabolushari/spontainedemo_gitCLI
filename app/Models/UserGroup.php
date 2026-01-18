<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'group_id', 'id');
    }
}
