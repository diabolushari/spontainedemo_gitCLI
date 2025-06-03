<?php

namespace App\Models\Insights;

use Illuminate\Database\Eloquent\Model;

class Insights extends Model
{
    protected $primaryKey = 'insight_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'insight_id',
        'title',
        'description',
        'risk'
    ];
}
