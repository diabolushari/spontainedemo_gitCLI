<?php

namespace App\Models\Blocks;

use App\Models\PageBuilder\PageBuilder;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $table = 'blocks';

    protected $fillable = [
        'name',
        'position',
        'dimensions',
        'page_id',
    ];

    protected $casts = [
        'dimensions' => 'array',
    ];

    public function page()
    {
        return $this->belongsTo(PageBuilder::class);
    }
}
