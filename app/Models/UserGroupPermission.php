<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroupPermission extends Model
{
        use SoftDeletes;
    protected $fillable = [
        'group_id',
        'role'
    ];
}
