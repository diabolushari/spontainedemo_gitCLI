<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetaStructureLabel extends Model
{
    protected $fillable = [
        'structure_id',
        'data_classification_property_id',
    ];

    public function structure(): BelongsTo
    {
        return $this->belongsTo(MetaStructure::class, 'structure_id');
    }

    public function dataClassificationProperty(): BelongsTo
    {
        return $this->belongsTo(DataClassificationProperty::class, 'data_classification_property_id');
    }
}
