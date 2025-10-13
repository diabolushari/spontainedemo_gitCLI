<?php

namespace App\Models\Blocks;

use App\Models\PageBuilder\PageBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PageBlock extends Model
{

    use  SoftDeletes;

    protected $table = 'blocks';

    protected $fillable = [
        'name',
        'position',
        'dimensions',
        'page_id',
        'data'
    ];

    protected $casts = [
        'dimensions' => 'array',
        'data' => 'array'
    ];

    /**
     * @return BelongsTo<PageBuilder, $this>
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(PageBuilder::class);
    }
}
