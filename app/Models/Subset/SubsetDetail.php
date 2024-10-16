<?php

namespace App\Models\Subset;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int|null $data_detail_id
 * @property int $group_data
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereDataDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereGroupData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubsetDetail withoutTrashed()
 *
 * @mixin \Eloquent
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
}
