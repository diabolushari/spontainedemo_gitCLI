<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
     * @return BelongsTo<MetaStructure, $this>
     */
    public function metaStructure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'meta_structure_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyItem, $this>
     */
    public function hierarchyPrimaryField(): HasMany
    {
        return $this->hasMany(MetaHierarchyItem::class, 'primary_field_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyItem, $this>
     */
    public function hierarchySecondaryField(): HasMany
    {
        return $this->hasMany(MetaHierarchyItem::class, 'secondary_field_id', 'id');
    }

    /**
     * @return HasMany<MetaHierarchyItem, $this>
     */
    public function secondaryField(): HasMany
    {
        return $this->hasMany(MetaHierarchyItem::class, 'secondary_field_id', 'id');
    }

    /**
     * @return HasMany<MetaGroupItem, $this>
     */
    public function groupItem(): HasMany
    {
        return $this->hasMany(MetaGroupItem::class, 'meta_data_id', 'id');
    }

    /**
     * Scope a query to join the structure table
     *
     * @param  Builder<MetaStructure>  $builder
     * @return Builder<MetaStructure>W
     */
    public function scopeJoinStructure(Builder $builder): Builder
    {
        return $builder->join('meta_structures', 'meta_structures.id', '=', 'meta_data.meta_structure_id');
    }
}
