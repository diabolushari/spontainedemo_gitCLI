<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetaGroupItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meta_group_id',
        'meta_data_id',
    ];

    /**
     * @return BelongsTo<MetaGroup, MetaGroupItem>
     */
    public function metaDataGroup(): BelongsTo
    {
        return $this->belongsTo(MetaGroup::class, 'meta_group_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, MetaGroupItem>
     */
    public function metaData(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'meta_data_id', 'id');
    }

    /**
     * @param  Builder<MetaGroupItem>  $query
     * @return Builder<MetaGroupItem>
     */
    public function scopeJoinMetaData(Builder $query): Builder
    {
        return $query->join('meta_data', 'meta_data.id', '=', 'meta_group_items.meta_data_id');
    }

    /**
     * @param  Builder<MetaGroupItem>  $query
     * @return Builder<MetaGroupItem>
     */
    public function scopeJoinMetaroup(Builder $query): Builder
    {
        return $query->join('meta_groups', 'meta_groups.id', '=', 'meta_group_items.meta_group_id');
    }
}
