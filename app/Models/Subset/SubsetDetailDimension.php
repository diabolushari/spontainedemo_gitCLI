<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableDimension;
use App\Models\Meta\MetaHierarchy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetDetailDimension extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'subset_field_name',
        'subset_column',
        'filter_only',
        'column_expression',
        'filters',
        'created_by',
        'updated_by',
        'hierarchy_id',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'filters' => 'array',
    ];

    /**
     * @return HasOne<DataTableDimension, $this>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableDimension::class, 'id', 'field_id');
    }

    /**
     * @return HasOne<MetaHierarchy, $this>
     */
    public function hierarchy(): HasOne
    {
        return $this->hasOne(MetaHierarchy::class, 'id', 'hierarchy_id');
    }
}
