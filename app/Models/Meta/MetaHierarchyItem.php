<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $meta_hierarchy_id
 * @property int|null $parent_id
 * @property int $meta_data_id
 * @property int $level
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Meta\MetaData $metaData
 * @property-read \App\Models\Meta\MetaHierarchy $metaHierarchy
 * @property-read MetaHierarchyItem|null $parent
 * @method static Builder|MetaHierarchyItem joinMetaData()
 * @method static Builder|MetaHierarchyItem newModelQuery()
 * @method static Builder|MetaHierarchyItem newQuery()
 * @method static Builder|MetaHierarchyItem onlyTrashed()
 * @method static Builder|MetaHierarchyItem query()
 * @method static Builder|MetaHierarchyItem whereCreatedAt($value)
 * @method static Builder|MetaHierarchyItem whereDeletedAt($value)
 * @method static Builder|MetaHierarchyItem whereId($value)
 * @method static Builder|MetaHierarchyItem whereLevel($value)
 * @method static Builder|MetaHierarchyItem whereMetaDataId($value)
 * @method static Builder|MetaHierarchyItem whereMetaHierarchyId($value)
 * @method static Builder|MetaHierarchyItem whereParentId($value)
 * @method static Builder|MetaHierarchyItem whereUpdatedAt($value)
 * @method static Builder|MetaHierarchyItem withTrashed()
 * @method static Builder|MetaHierarchyItem withoutTrashed()
 * @mixin \Eloquent
 */
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
     * @return BelongsTo<MetaHierarchyItem, MetaHierarchyItem>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchyItem::class, 'parent_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, MetaHierarchyItem>
     */
    public function metaData(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'meta_data_id', 'id');
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
