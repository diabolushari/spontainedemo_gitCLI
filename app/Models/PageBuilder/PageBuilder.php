<?php

namespace App\Models\PageBuilder;

use App\Models\Blocks\PageBlock;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Blocks\PageBlock[] $blocks
 */
class PageBuilder extends Model
{
    use HasFactory;

    protected $table = 'pages';

    protected $fillable = [
        'title',
        'url',
        'description',
        'published_at',
    ];

    protected $dates = [
        'published_at',
    ];

    public function blocks()
    {
        return $this->hasMany(PageBlock::class, 'page_id');
    }
}
