<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroupContext extends Model
{
    use SoftDeletes;

    protected $fillable = [
      //fields
        'group_id',
        'context',
    ];

    public function group()
    {
        return $this->belongsTo(UserGroup::class, 'group_id', 'id');
    }
}
