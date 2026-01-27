<?php

namespace App\Models;

use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'address',
        'state',
        'country',
        'industry_context',
        'objectives',
        'meta_hierarchy_item_id',
        'hierarchy_connection',
    ];

    protected $casts = [
        'objectives' => 'array',
    ];

    /**
     * @return BelongsTo<MetaHierarchyItem, $this>
     */
    public function metaHierarchyItem(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchyItem::class);
    }
}
