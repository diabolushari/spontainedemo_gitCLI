<?php

namespace App\Models\DataLoader;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $cron_type
 * @property string|null $start_date
 * @property string|null $end_date
 * @property string|null $schedule_time
 * @property string|null $day_of_week
 * @property int|null $day_of_month
 * @property int|null $month_of_year
 * @property int $query_id
 * @property int $data_detail_id
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read DataDetail|null $detail
 * @property-read \App\Models\DataLoader\DataLoaderJobStatus|null $lastStatus
 * @property-read \App\Models\DataLoader\DataLoaderJobStatus|null $latest
 * @property-read \App\Models\DataLoader\DataLoaderQuery|null $loaderQuery
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DataLoader\DataLoaderJobStatus> $statuses
 * @property-read int|null $statuses_count
 * @method static Builder|DataLoaderJob active()
 * @method static Builder|DataLoaderJob newModelQuery()
 * @method static Builder|DataLoaderJob newQuery()
 * @method static Builder|DataLoaderJob onlyTrashed()
 * @method static Builder|DataLoaderJob query()
 * @method static Builder|DataLoaderJob whereCreatedAt($value)
 * @method static Builder|DataLoaderJob whereCreatedBy($value)
 * @method static Builder|DataLoaderJob whereCronType($value)
 * @method static Builder|DataLoaderJob whereDataDetailId($value)
 * @method static Builder|DataLoaderJob whereDayOfMonth($value)
 * @method static Builder|DataLoaderJob whereDayOfWeek($value)
 * @method static Builder|DataLoaderJob whereDeletedAt($value)
 * @method static Builder|DataLoaderJob whereDescription($value)
 * @method static Builder|DataLoaderJob whereEndDate($value)
 * @method static Builder|DataLoaderJob whereId($value)
 * @method static Builder|DataLoaderJob whereMonthOfYear($value)
 * @method static Builder|DataLoaderJob whereName($value)
 * @method static Builder|DataLoaderJob whereQueryId($value)
 * @method static Builder|DataLoaderJob whereScheduleTime($value)
 * @method static Builder|DataLoaderJob whereStartDate($value)
 * @method static Builder|DataLoaderJob whereUpdatedAt($value)
 * @method static Builder|DataLoaderJob whereUpdatedBy($value)
 * @method static Builder|DataLoaderJob withTrashed()
 * @method static Builder|DataLoaderJob withoutTrashed()
 * @mixin \Eloquent
 */
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

    /**
     * @return HasOne<DataLoaderJobStatus>
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
        return $this->hasMany(DataLoaderJobStatus::class, 'loader_job_id', 'id');
    }
    /**
     * @return HasOne<DataLoaderJobStatus>
     */
    public function latest(): HasOne
    {
        return $this->hasOne(DataLoaderJobStatus::class, 'loader_job_id', 'id')->latestOfMany();
    }
}
