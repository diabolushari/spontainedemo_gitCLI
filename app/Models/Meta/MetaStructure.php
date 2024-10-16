<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $structure_name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meta\MetaData> $metaData
 * @property-read int|null $meta_data_count
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure query()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereStructureName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|MetaStructure withoutTrashed()
 * @mixin \Eloquent
 */
class MetaStructure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'structure_name',
        'description',
        'deleted_at',
    ];

    /**
     * @return HasMany<MetaData>
     */
    public function metaData(): HasMany
    {
        return $this->hasMany(MetaData::class, 'meta_structure_id', 'id');
    }
}
