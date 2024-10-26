<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableMeasure;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $subset_detail_id
 * @property string|null $column
 * @property string|null $aggregation
 * @property Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|SubsetDetailMeasure newModelQuery()
 * @method static Builder|SubsetDetailMeasure newQuery()
 * @method static Builder|SubsetDetailMeasure onlyTrashed()
 * @method static Builder|SubsetDetailMeasure query()
 * @method static Builder|SubsetDetailMeasure whereAggregation($value)
 * @method static Builder|SubsetDetailMeasure whereColumn($value)
 * @method static Builder|SubsetDetailMeasure whereCreatedAt($value)
 * @method static Builder|SubsetDetailMeasure whereCreatedBy($value)
 * @method static Builder|SubsetDetailMeasure whereDeletedAt($value)
 * @method static Builder|SubsetDetailMeasure whereId($value)
 * @method static Builder|SubsetDetailMeasure whereSubsetDetailId($value)
 * @method static Builder|SubsetDetailMeasure whereUpdatedAt($value)
 * @method static Builder|SubsetDetailMeasure whereUpdatedBy($value)
 * @method static Builder|SubsetDetailMeasure withTrashed()
 * @method static Builder|SubsetDetailMeasure withoutTrashed()
 *
 * @mixin Eloquent
 */
class SubsetDetailMeasure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'weight_field_id',
        'expression',
        'aggregation',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataTableMeasure>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableMeasure::class, 'id', 'field_id');
    }

    /**
     * @return HasOne<DataTableMeasure>
     */
    public function weightInfo(): HasOne
    {
        return $this->hasOne(DataTableMeasure::class, 'id', 'weight_field_id');
    }
}
