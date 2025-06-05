<?php

use App\Services\DataLoader\ScheduledQuery\StartScheduledJobs;

Schedule::call(function () {
    $runScheduleQuery = new StartScheduledJobs;
    $runScheduleQuery->run();
})->everyMinute();

Schedule::command('app:generate-title-command')->everyTenMinutes();
