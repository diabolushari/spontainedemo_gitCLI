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
        'primary_field_id',
        'secondary_field_id',
        'level',
    ];

    public function metaHierarchy(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchy::class, 'meta_hierarchy_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, $this>
     */
    public function primaryField(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'primary_field_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, $this>
     */
    public function secondaryField(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'secondary_field_id', 'id');
    }

    /**
     * @return BelongsTo<MetaHierarchyItem, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchyItem::class, 'parent_id', 'id');
    }
}
