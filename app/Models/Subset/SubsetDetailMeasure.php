<?php

namespace App\Models\Subset;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $subset_detail_id
 * @property string|null $column
 * @property string|null $aggregation
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereAggregation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereSubsetDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailMeasure withoutTrashed()
 *
 * @mixin \Eloquent
 */
class SubsetDetailMeasure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'aggregation',
        'created_by',
        'updated_by',
    ];
}
