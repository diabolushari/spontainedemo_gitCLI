<?php

namespace App\Models\Dashboard;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Dashboardtable extends Model
{
    use SoftDeletes;
     protected $fillable = [
        'title',
        'url',
        'description',
        'published_at',
    ];
}
