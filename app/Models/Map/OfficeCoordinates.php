<?php

namespace App\Models\Map;

use Illuminate\Database\Eloquent\Model;

class OfficeCoordinates extends Model
{
    protected $table = 'office_coordinates';

    protected $fillable = [
        'level',
        'circle',
        'office_id',
        'office_code',
        'office_name',
        'latitude',
        'longitude',
    ];
}
