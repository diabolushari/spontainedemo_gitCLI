<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
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

    /**
     * @return BelongsTo<MetaHierarchy, $this>
     */
    public function primaryField(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'primary_field_id', 'id');
    }

    /**
     * @return BelongsTo<MetaHierarchy, $this>
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

    /**
     * @param  Builder<MetaHierarchyItem>  $builder
     * @return Builder<MetaHierarchyItem>
     */
    public function scopeJoinMetaData(Builder $builder): Builder
    {
        return $builder->join('meta_data', 'meta_data.id', '=', 'meta_hierarchy_items.meta_data_id')
            ->join('meta_structures', 'meta_structures.id', '=', 'meta_data.meta_structure_id');
    }
}
