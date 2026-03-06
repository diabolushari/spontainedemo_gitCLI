<?php

namespace App\Models;

use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationHierarchy extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id',
        'meta_hierarchy_item_id',
        'hierarchy_connection'
    ];

     public function metaHierarchyItem(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchyItem::class);
    }
}
