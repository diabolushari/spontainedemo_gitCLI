<?php

namespace App\Models\DataLoader;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataLoaderJob extends Model
{
    use SoftDeletes;

    protected $table = 'loader_jobs';

    protected $fillable = [
        'name',
        'description',
        'cron_type',
        'start_date',
        'end_date',
        'schedule_time',
        'day_of_week',
        'day_of_month',
        'month_of_year',
        'query_id',
        'data_detail_id',
        'created_by',
        'updated_by',
    ];

    //relationships

    /**
     * @return HasOne<DataLoaderQuery>
     */
    public function loaderQuery(): HasOne
    {
        return $this->hasOne(DataLoaderQuery::class, 'id', 'query_id');
    }

    /**
     * @return HasOne<DataDetail>
     */
    public function detail(): HasOne
    {
        return $this->hasOne(DataDetail::class, 'id', 'data_detail_id');
    }

    //scopes
}
