<?php

namespace App\Models\Subset;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $subset_detail_id
 * @property string|null $column
 * @property int $filter_only
 * @property string|null $column_expression
 * @property string|null $filters
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereColumnExpression($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereFilterOnly($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereFilters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereSubsetDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDimension withoutTrashed()
 *
 * @mixin \Eloquent
 */
class SubsetDetailDimension extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'filter_only',
        'column_expression',
        'filters',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'filters' => 'array',
    ];
}
