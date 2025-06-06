<?php

use App\Services\DataLoader\ScheduledQuery\StartScheduledJobs;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $runScheduleQuery = new StartScheduledJobs;
    $runScheduleQuery->run();
})->everyMinute();

Schedule::command('app:generate-title-command')->everyMinute();
