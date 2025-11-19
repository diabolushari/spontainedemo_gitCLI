<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;

class DataClassificationProperty extends Model
{
    protected $fillable = [
        'property_type',
        'property_value',
        'order',
    ];
}
