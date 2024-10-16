<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableDimension;
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
 * @property int $filter_only
 * @property string|null $column_expression
 * @property string|null $filters
 * @property Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|SubsetDetailDimension newModelQuery()
 * @method static Builder|SubsetDetailDimension newQuery()
 * @method static Builder|SubsetDetailDimension onlyTrashed()
 * @method static Builder|SubsetDetailDimension query()
 * @method static Builder|SubsetDetailDimension whereColumn($value)
 * @method static Builder|SubsetDetailDimension whereColumnExpression($value)
 * @method static Builder|SubsetDetailDimension whereCreatedAt($value)
 * @method static Builder|SubsetDetailDimension whereCreatedBy($value)
 * @method static Builder|SubsetDetailDimension whereDeletedAt($value)
 * @method static Builder|SubsetDetailDimension whereFilterOnly($value)
 * @method static Builder|SubsetDetailDimension whereFilters($value)
 * @method static Builder|SubsetDetailDimension whereId($value)
 * @method static Builder|SubsetDetailDimension whereSubsetDetailId($value)
 * @method static Builder|SubsetDetailDimension whereUpdatedAt($value)
 * @method static Builder|SubsetDetailDimension whereUpdatedBy($value)
 * @method static Builder|SubsetDetailDimension withTrashed()
 * @method static Builder|SubsetDetailDimension withoutTrashed()
 *
 * @mixin Eloquent
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

    /**
     * @return HasOne<DataTableDimension>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableDimension::class, 'id', 'field_id');
    }
}
