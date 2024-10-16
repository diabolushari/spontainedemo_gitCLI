<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $meta_group_id
 * @property int $meta_data_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Meta\MetaData $metaData
 * @property-read \App\Models\Meta\MetaGroup $metaDataGroup
 * @method static Builder|MetaGroupItem joinMetaData()
 * @method static Builder|MetaGroupItem joinMetaroup()
 * @method static Builder|MetaGroupItem newModelQuery()
 * @method static Builder|MetaGroupItem newQuery()
 * @method static Builder|MetaGroupItem onlyTrashed()
 * @method static Builder|MetaGroupItem query()
 * @method static Builder|MetaGroupItem whereCreatedAt($value)
 * @method static Builder|MetaGroupItem whereDeletedAt($value)
 * @method static Builder|MetaGroupItem whereId($value)
 * @method static Builder|MetaGroupItem whereMetaDataId($value)
 * @method static Builder|MetaGroupItem whereMetaGroupId($value)
 * @method static Builder|MetaGroupItem whereUpdatedAt($value)
 * @method static Builder|MetaGroupItem withTrashed()
 * @method static Builder|MetaGroupItem withoutTrashed()
 * @mixin \Eloquent
 */
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
