<?php

namespace App\Models\DataDetail;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\SubjectArea\SubjectArea;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $subject_area
 * @property string $table_name
 * @property int $is_active
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DataTableDate> $dateFields
 * @property-read int|null $date_fields_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DataTableDimension> $dimensionFields
 * @property-read int|null $dimension_fields_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, DataTableMeasure> $measureFields
 * @property-read int|null $measure_fields_count
 * @property-read SubjectArea|null $subjectArea
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereSubjectArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereTableName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataDetail withoutTrashed()
 * @mixin \Eloquent
 */
class DataDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'subject_area',
        'is_active',
        'table_name',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasMany<DataTableDate>
     */
    public function dateFields(): HasMany
    {
        return $this->hasMany(DataTableDate::class, 'data_detail_id', 'id');
    }

    /**
     * @return HasMany<DataTableDimension>
     */
    public function dimensionFields(): HasMany
    {
        return $this->hasMany(DataTableDimension::class, 'data_detail_id', 'id');
    }

    /**
     * @return HasMany<DataTableMeasure>
     */
    public function measureFields(): HasMany
    {
        return $this->hasMany(DataTableMeasure::class, 'data_detail_id', 'id');
    }

    /**
     * @return BelongsTo<DataDetail, SubjectArea>
     */
    public function subjectArea(): BelongsTo
    {
        return $this->belongsTo(SubjectArea::class, 'subject_area_id', 'id');
    }
}
