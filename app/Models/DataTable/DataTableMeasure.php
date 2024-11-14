<?php

namespace App\Models\DataTable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataTableMeasure extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'data_table_field',
        'data_table_unit_field',
        'field_name',
        'unit_field_name',
        'created_by',
        'updated_by',
    ];
}
