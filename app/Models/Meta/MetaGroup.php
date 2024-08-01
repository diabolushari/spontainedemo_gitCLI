<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetaGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return HasMany<MetaGroupItem>
     */
    public function items(): HasMany
    {
        return $this->hasMany(MetaGroupItem::class, 'meta_group_id', 'id');
    }
}
