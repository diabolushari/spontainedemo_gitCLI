<?php

namespace App\Models\DataTable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $data_detail_id
 * @property string $column
 * @property string|null $unit_column
 * @property string $field_name
 * @property string|null $unit_field_name
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereDataDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereFieldName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereUnitColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereUnitFieldName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableMeasure withoutTrashed()
 * @mixin \Eloquent
 */
class DataTableMeasure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'data_table_field',
        'data_table_unit_field',
        'field_name',
        'unit_field_name',
        'created_by',
        'updated_by',
    ];
}
