<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetaHierarchyItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meta_hierarchy_id',
        'parent_id',
        'meta_data_id',
        'level',
    ];

    /**
     * @return BelongsTo<MetaHierarchy, MetaHierarchyItem>
     */
    public function metaHierarchy(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchy::class, 'meta_hierarchy_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, MetaHierarchyItem>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'parent_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, MetaHierarchyItem>
     */
    public function metaData(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'meta_data_id', 'id');
    }
}
