<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationObjectives extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id',
        'period_start',
        'period_end',
        'objective',
    ];
}
