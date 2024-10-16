<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaGroupItem> $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaGroup withoutTrashed()
 * @mixin \Eloquent
 */
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
