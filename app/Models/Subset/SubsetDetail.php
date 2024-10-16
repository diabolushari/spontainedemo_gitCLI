<?php

namespace App\Models\Subset;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int|null $data_detail_id
 * @property int $group_data
 * @property Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|SubsetDetail newModelQuery()
 * @method static Builder|SubsetDetail newQuery()
 * @method static Builder|SubsetDetail onlyTrashed()
 * @method static Builder|SubsetDetail query()
 * @method static Builder|SubsetDetail whereCreatedAt($value)
 * @method static Builder|SubsetDetail whereCreatedBy($value)
 * @method static Builder|SubsetDetail whereDataDetailId($value)
 * @method static Builder|SubsetDetail whereDeletedAt($value)
 * @method static Builder|SubsetDetail whereDescription($value)
 * @method static Builder|SubsetDetail whereGroupData($value)
 * @method static Builder|SubsetDetail whereId($value)
 * @method static Builder|SubsetDetail whereName($value)
 * @method static Builder|SubsetDetail whereUpdatedAt($value)
 * @method static Builder|SubsetDetail whereUpdatedBy($value)
 * @method static Builder|SubsetDetail withTrashed()
 * @method static Builder|SubsetDetail withoutTrashed()
 *
 * @mixin Eloquent
 */
class SubsetDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'data_detail_id',
        'group_data',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasMany<SubsetDetailDate>
     */
    public function dates(): HasMany
    {
        return $this->hasMany(SubsetDetailDate::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailDimension>
     */
    public function dimensions(): HasMany
    {
        return $this->hasMany(SubsetDetailDimension::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailMeasure>
     */
    public function measures(): HasMany
    {
        return $this->hasMany(SubsetDetailMeasure::class, 'subset_detail_id', 'id');
    }
}
