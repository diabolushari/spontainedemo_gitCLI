<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableMeasure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetDetailMeasure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'subset_field_name',
        'subset_column',
        'sort_order',
        'column',
        'aggregation',
        'expression',
        'weight_field_id',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataTableMeasure>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableMeasure::class, 'id', 'field_id');
    }

    /**
     * @return HasOne<DataTableMeasure>
     */
    public function weightInfo(): HasOne
    {
        return $this->hasOne(DataTableMeasure::class, 'id', 'weight_field_id');
    }
}
