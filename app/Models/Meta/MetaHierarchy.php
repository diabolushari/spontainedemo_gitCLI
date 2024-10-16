<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaHierarchyItem> $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaHierarchyLevelInfo> $level
 * @property-read int|null $level_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaHierarchyLevelInfo> $levelInfos
 * @property-read int|null $level_infos_count
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy query()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchy withoutTrashed()
 * @mixin \Eloquent
 */
class MetaHierarchy extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return HasMany<MetaHierarchyItem>
     */
    public function items(): HasMany
    {
        return $this->hasMany(MetaHierarchyItem::class, 'meta_hierarchy_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyLevelInfo>
     */
    public function level(): HasMany
    {
        return $this->hasMany(MetaHierarchyLevelInfo::class, 'meta_hierarchy_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyLevelInfo>
     */
    public function levelInfos(): HasMany
    {
        return $this->hasMany(MetaHierarchyLevelInfo::class, 'meta_hierarchy_id', 'id');
    }
}
