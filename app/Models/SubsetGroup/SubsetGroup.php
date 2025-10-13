<?php

namespace App\Models\SubsetGroup;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
    ];

    //relationships

    /**
     * @return HasMany<SubsetGroupItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(SubsetGroupItem::class, 'subset_group_id', 'id');
    }

    //scopes
}
