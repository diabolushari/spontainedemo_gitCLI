<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $meta_structure_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaGroupItem> $groupItem
 * @property-read int|null $group_item_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaHierarchyItem> $hierarchyItem
 * @property-read int|null $hierarchy_item_count
 * @property-read \App\Models\Meta\MetaStructure $metaStructure
 * @method static Builder|MetaData joinStructure()
 * @method static Builder|MetaData newModelQuery()
 * @method static Builder|MetaData newQuery()
 * @method static Builder|MetaData onlyTrashed()
 * @method static Builder|MetaData query()
 * @method static Builder|MetaData whereCreatedAt($value)
 * @method static Builder|MetaData whereDeletedAt($value)
 * @method static Builder|MetaData whereDescription($value)
 * @method static Builder|MetaData whereId($value)
 * @method static Builder|MetaData whereMetaStructureId($value)
 * @method static Builder|MetaData whereName($value)
 * @method static Builder|MetaData whereUpdatedAt($value)
 * @method static Builder|MetaData withTrashed()
 * @method static Builder|MetaData withoutTrashed()
 * @mixin \Eloquent
 */
class MetaData extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'meta_structure_id',
        'deleted_at',
    ];

    /**
     * Get the meta structure that owns the MetaData
     *
     * @return BelongsTo<MetaStructure, MetaData>
     */
    public function metaStructure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'meta_structure_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyItem>
     */
    public function hierarchyItem(): HasMany
    {
        return $this->hasMany(MetaHierarchyItem::class, 'meta_data_id', 'id');
    }

     /**
     * @return HasMany<MetaGroupItem>
     */
    public function groupItem(): HasMany
    {
        return $this->hasMany(MetaGroupItem::class,'meta_data_id','id');
    }

    /**
     * Scope a query to join the structure table
     *
     * @param  Builder<MetaStructure>  $builder
     * @return Builder<MetaStructure>
     */
    public function scopeJoinStructure(Builder $builder): Builder
    {
        return $builder->join('meta_structures', 'meta_structures.id', '=', 'meta_data.meta_structure_id');
    }
}
