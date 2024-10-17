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
 * @property string $field_name
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereDataDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereFieldName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDate withoutTrashed()
 * @mixin \Eloquent
 */
class DataTableDate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'data_table_field',
        'column',
        'field_name',
        'created_by',
        'updated_by',
    ];
}
