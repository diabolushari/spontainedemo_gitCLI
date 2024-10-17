<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableDate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetDetailDate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'start_date',
        'end_date',
        'use_dynamic_date',
        'use_last_found_data',
        'dynamic_start_type',
        'dynamic_end_type',
        'dynamic_start_offset',
        'dynamic_start_unit',
        'dynamic_end_offset',
        'dynamic_end_unit',
        'date_field_expression',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataTableDate>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableDate::class, 'id', 'field_id');
    }
}
