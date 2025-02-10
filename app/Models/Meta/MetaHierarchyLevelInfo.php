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
        'name',
        'primary_field_structure_id',
        'secondary_field_structure_id',
    ];

    /**
     * @return BelongsTo<MetaStructure, $this>
     */
    public function primaryStructure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'primary_field_structure_id', 'id');
    }

    /**
     * @return BelongsTo<MetaStructure, $this>
     */
    public function secondaryStructure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'secondary_field_structure_id', 'id');
    }
}
