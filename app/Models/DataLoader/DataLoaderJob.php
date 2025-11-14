<?php

namespace App\Models\DataLoader;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'delete_existing_data',
        'duplicate_identification_field',
        'query_id',
        'data_detail_id',
        'predecessor_job_id',
        'created_by',
        'updated_by',
        'source_type',
        'api_id',
        'field_mapping',
        'schedule_start_time',
        'sub_hour_interval',
    ];

    protected $casts = [
        'field_mapping' => 'array',
    ];

    //relationships

    /**
     * @return HasOne<DataLoaderQuery, $this>
     */
    public function loaderQuery(): HasOne
    {
        return $this->hasOne(DataLoaderQuery::class, 'id', 'query_id');
    }

    /**
     * @return HasOne<DataDetail, $this>
     */
    public function detail(): HasOne
    {
        return $this->hasOne(DataDetail::class, 'id', 'data_detail_id');
    }

    /**
     * @return HasOne<DataLoaderJobStatus, $this>
     */
    public function lastStatus(): HasOne
    {
        return $this->hasOne(DataLoaderJobStatus::class, 'loader_job_id', 'id')
            ->latest();
    }

    //scopes
    /**
     * @param  Builder<DataLoaderJob>  $builder
     * @return Builder<DataLoaderJob>
     */
    public function scopeActive(Builder $builder): Builder
    {
        $now = now()->toDateString();

        return $builder->whereDate('start_date', '<=', $now)
            ->where(function (Builder $query) use ($now) {
                $query->whereDate('end_date', '>=', $now)
                    ->orWhereNull('end_date');
            });
    }

    /**
     * @return HasMany<DataLoaderJobStatus>
     */
    public function statuses(): HasMany
    {
        return $this->hasMany(DataLoaderJobStatus::class, 'loader_job_id', 'id')
            ->orderBy('executed_at', 'desc');
    }

    /**
     * Get the latest job status
     *
     * @return HasOne<DataLoaderJobStatus>
     */
    public function latest(): HasOne
    {
        return $this->hasOne(DataLoaderJobStatus::class, 'loader_job_id', 'id')->latestOfMany();
    }

    /**
     * @return BelongsTo<DataLoaderJob, $this>
     */
    public function predecessor(): BelongsTo
    {
        return $this->belongsTo(DataLoaderJob::class, 'predecessor_job_id', 'id');
    }

    /**
     * @return HasOne<LoaderAPI, $this>
     */
    public function api(): HasOne
    {
        return $this->hasOne(LoaderAPI::class, 'id', 'api_id');
    }
}
