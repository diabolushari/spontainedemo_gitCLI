<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationContextHistory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id',
        'context'
    ];

    
}
