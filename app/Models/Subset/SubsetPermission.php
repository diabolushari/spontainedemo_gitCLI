<?php

namespace App\Models\Subset;

use App\Models\UserGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetPermission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_id',
        'group_id',
    ];

    public function groups(): HasOne
    {
        return $this->hasOne(UserGroup::class, 'id', 'group_id');
    }
}
