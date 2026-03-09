<?php

namespace App\Models\Subset;

use App\Models\DataTable\DataTableText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetDetailText extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subset_detail_id',
        'field_id',
        'subset_field_name',
        'subset_column',
        'sort_order',
        'description',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataTableText>
     */
    public function info(): HasOne
    {
        return $this->hasOne(DataTableText::class, 'id', 'field_id');
    }
}
