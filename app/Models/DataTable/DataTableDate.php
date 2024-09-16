<?php

namespace App\Models\DataTable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataTableDate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'data_table_field',
        'column',
        'field_name',
        'created_by',
        'updated_by',
    ];
}
