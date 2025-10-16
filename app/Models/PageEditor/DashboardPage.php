<?php

namespace App\Models\PageEditor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardPage extends Model
{
    use HasFactory;

    protected $table = 'dashboard_pages';

    protected $fillable = [
        'title',
        'description',
        'link',
        'page',
        'published',
    ];

    protected $casts = [
        'page' => 'array',
        'published' => 'boolean',
    ];
}
