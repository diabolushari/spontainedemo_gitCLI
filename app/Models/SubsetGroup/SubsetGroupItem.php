<?php

namespace App\Models\SubsetGroup;

use App\Models\Subset\SubsetDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetGroupItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'item_number',
        'name',
        'subset_group_id',
        'subset_detail_id',
        'trend_field',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<SubsetGroupItem, SubsetDetail>
     */
    public function subset(): HasOne
    {
        return $this->hasOne(SubsetDetail::class, 'id', 'subset_detail_id');
    }

    
}
