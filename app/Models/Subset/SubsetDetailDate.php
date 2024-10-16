<?php

namespace App\Models\Subset;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $subset_detail_id
 * @property string|null $column
 * @property string|null $start_date
 * @property string|null $end_date
 * @property int $use_dynamic_date
 * @property string|null $use_last_found_data
 * @property string|null $dynamic_start_type
 * @property string|null $dynamic_end_type
 * @property int $dynamic_start_offset
 * @property string|null $dynamic_start_unit
 * @property int $dynamic_end_offset
 * @property string|null $dynamic_end_unit
 * @property string|null $date_field_expression
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDateFieldExpression($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicEndOffset($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicEndType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicEndUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicStartOffset($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicStartType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereDynamicStartUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereSubsetDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereUseDynamicDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate whereUseLastFoundData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetailDate withoutTrashed()
 *
 * @mixin \Eloquent
 */
class SubsetDetailDate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'start_date',
        'end_date',
        'use_dynamic_date',
        'use_last_found_data',
        'dynamic_start_type',
        'dynamic_end_type',
        'dynamic_start_offset',
        'dynamic_start_unit',
        'dynamic_end_offset',
        'dynamic_end_unit',
        'date_field_expression',
        'created_by',
        'updated_by',
    ];
}
