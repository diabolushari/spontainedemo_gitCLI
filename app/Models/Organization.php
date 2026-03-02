<?php

namespace App\Models;

use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'address',
        'state',
        'country',
        'industry_context',
        // 'objectives',
        // 'meta_hierarchy_item_id',
        // 'hierarchy_connection',
        'logo',
        'primary_colour',
        'secondary_colour',
        'tertiary_colour',
    ];

    protected $casts = [
        'objectives' => 'array',
    ];

    // /**
    //  * @return BelongsTo<MetaHierarchyItem, $this>
    //  */
    // public function metaHierarchyItem(): BelongsTo
    // {
    //     return $this->belongsTo(MetaHierarchyItem::class);
    // }

    public function hierarchy(): HasOne
    {
        return $this->hasOne(OrganizationHierarchy::class, 'organization_id', 'id');
    }

    public function objectives(): HasMany
    {
        return $this->hasMany(OrganizationObjectives::class, 'organization_id', 'id');
    }
}
