<?php

namespace App\Models\Subset;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubsetDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'data_detail_id',
        'group_data',
        'type',
        'max_rows_to_fetch',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataDetail>
     */
    public function dataDetail(): HasOne
    {
        return $this->hasOne(DataDetail::class, 'id', 'data_detail_id');
    }

    /**
     * @return HasMany<SubsetDetailDate>
     */
    public function dates(): HasMany
    {
        return $this->hasMany(SubsetDetailDate::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailDimension>
     */
    public function dimensions(): HasMany
    {
        return $this->hasMany(SubsetDetailDimension::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailMeasure>
     */
    public function measures(): HasMany
    {
        return $this->hasMany(SubsetDetailMeasure::class, 'subset_detail_id', 'id');
    }
}
