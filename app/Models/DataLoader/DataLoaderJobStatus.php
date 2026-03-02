<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @property int $id
 * @property int $loader_job_id
 * @property string $executed_at
 * @property string|null $completed_at
 * @property int $is_successful
 * @property string|null $error_message
 * @property bool $is_retry
 * @property int $retry_attempt
 * @property int|null $total_records
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereExecutedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereIsSuccessful($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereLoaderJobId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereTotalRecords($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|DataLoaderJobStatus withoutTrashed()
 * @mixin \Eloquent
 */
class DataLoaderJobStatus extends Model
{
    use SoftDeletes;

    protected $table = 'loader_job_statuses';

    protected $fillable = [
        'loader_job_id',
        'executed_at',
        'completed_at',
        'is_successful',
        'error_message',
        'is_retry',
        'retry_attempt',
        'total_records',
    ];
}
