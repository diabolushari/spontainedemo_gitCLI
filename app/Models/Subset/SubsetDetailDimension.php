<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableDimension;
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
        'sort_order',
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
