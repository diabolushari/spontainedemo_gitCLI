<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $meta_hierarchy_id
 * @property int $level
 * @property int $meta_structure_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Meta\MetaStructure $structure
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo query()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereMetaHierarchyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereMetaStructureId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaHierarchyLevelInfo withoutTrashed()
 * @mixin \Eloquent
 */
class MetaHierarchyLevelInfo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meta_hierarchy_id',
        'level',
        'meta_structure_id',
    ];

    /**
     * @return BelongsTo<MetaStructure, MetaHierarchyLevelInfo>
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'meta_structure_id', 'id');
    }
}
