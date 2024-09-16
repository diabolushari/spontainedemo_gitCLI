<?php

namespace App\Models\DataLoader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'total_records',
    ];
}
