<?php

namespace App\Models\PageBuilder;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageBuilder extends Model
{
    use HasFactory;


    protected $table = 'pages';

    protected $fillable = [
        'title',
        'url',
        'description',
        'date',
    ];

    protected $dates = [
        'date',
    ];
}
