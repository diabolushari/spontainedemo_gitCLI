<?php

namespace App\Models\Subset;

use App\Models\DataDetail\DataDetail;
use App\Models\Meta\MetaHierarchy;
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
        'heirarchy',
        'max_rows_to_fetch',
        'use_for_training_ai',
        'proactive_insight_instructions',
        'visualization_instructions',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasOne<DataDetail, $this>
     */
    public function dataDetail(): HasOne
    {
        return $this->hasOne(DataDetail::class, 'id', 'data_detail_id');
    }

    /**
     * @return HasMany<SubsetDetailDate, $this>
     */
    public function dates(): HasMany
    {
        return $this->hasMany(SubsetDetailDate::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailDimension, $this>
     */
    public function dimensions(): HasMany
    {
        return $this->hasMany(SubsetDetailDimension::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailMeasure, $this>
     */
    public function measures(): HasMany
    {
        return $this->hasMany(SubsetDetailMeasure::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasMany<SubsetDetailText, $this>
     */
    public function texts(): HasMany
    {
        return $this->hasMany(SubsetDetailText::class, 'subset_detail_id', 'id');
    }

    /**
     * @return HasOne<MetaHierarchy, $this>
     */
    public function heirarchy(): HasOne
    {
        return $this->hasOne(MetaHierarchy::class, 'id', 'heirarchy');
    }
}
