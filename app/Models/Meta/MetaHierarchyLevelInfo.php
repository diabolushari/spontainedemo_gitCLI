<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

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
