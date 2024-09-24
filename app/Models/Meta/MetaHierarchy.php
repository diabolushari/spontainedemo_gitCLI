<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    public function levelInfos()
    {
        return $this->hasMany(MetaHierarchyLevelInfo::class, 'meta_hierarchy_id', 'id');
    }
}
