<?php

namespace App\Models\SubjectArea;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $table_name
 * @property int $is_active
 * @property int $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereTableName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SubjectArea withoutTrashed()
 * @mixin \Eloquent
 */
class SubjectArea extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'table_name',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_at',
    ];
}
