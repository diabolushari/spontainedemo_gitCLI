<?php

namespace App\Models\Insights;

use Illuminate\Database\Eloquent\Model;

class Insights extends Model
{
    protected $fillable = [
        'insight_id',
        'title',
        'description',
        'risk'
    ];
}
