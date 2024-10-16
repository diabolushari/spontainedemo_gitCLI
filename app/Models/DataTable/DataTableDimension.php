<?php

namespace App\Models\DataTable;

use App\Models\Meta\MetaStructure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $data_detail_id
 * @property string $column
 * @property string $field_name
 * @property int $meta_structure_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read MetaStructure|null $structure
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereDataDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereFieldName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereMetaStructureId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataTableDimension withoutTrashed()
 * @mixin \Eloquent
 */
class DataTableDimension extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id', 'data_table_field', 'field_name', 'meta_structure_id', 'created_by', 'updated_by',
    ];

    /**
     * @return HasOne<MetaStructure>
     */
    public function structure(): HasOne
    {
        return $this->hasOne(MetaStructure::class, 'id', 'meta_structure_id');
    }
}
