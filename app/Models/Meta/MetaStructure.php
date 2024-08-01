<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetaStructure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'structure_name',
        'description',
        'deleted_at',
    ];
}
