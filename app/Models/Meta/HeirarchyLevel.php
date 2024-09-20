<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HeirarchyLevel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meta_hierarchy_id',
        'level',
        'heirarchy_name',
    ];

}
