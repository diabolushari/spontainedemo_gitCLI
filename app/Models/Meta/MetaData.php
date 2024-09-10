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
