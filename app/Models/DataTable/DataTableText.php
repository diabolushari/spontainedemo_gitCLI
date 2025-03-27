<?php

namespace App\Models\DataTable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataTableText extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'column',
        'field_name',
        'is_long_text',
        'created_by',
        'updated_by',
    ];
}
