<?php

namespace App\Models\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataTableRelation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id',
        'column',
        'field_name',
        'related_table_id',
        'created_by',
        'updated_by',
    ];

    /**
     * @return BelongsTo<DataDetail>
     */
    public function relatedTable(): BelongsTo
    {
        return $this->belongsTo(DataDetail::class, 'related_table_id', 'id');
    }

    public function dataTable(): BelongsTo
    {
        return $this->belongsTo(DataDetail::class, 'data_detail_id', 'id');
    }
}
