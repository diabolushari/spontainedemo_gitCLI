<?php

use App\Services\DataLoader\ScheduledQuery\StartScheduledJobs;

Schedule::call(function () {
    //    Log::info('Running scheduled job');
    //    $password = config('app.vpn_password');
    //    Log::info($password);
    //    $result = Process::run('snx -d');
    //    sleep(5);
    //    Log::info('disconnected');
    //    Log::info($result->output());
    //    $result = Process::run("echo $password | snx -s 125.17.229.163 -u xocortx");
    //    Log::info('result');
    //    Log::info($result->output());
})->everyTenMinutes();

Schedule::call(function () {
    \Illuminate\Support\Facades\Log::info('Running scheduled job: '.now()->toDateTimeString());
    $runScheduleQuery = new StartScheduledJobs;
    $runScheduleQuery->run();
})->everyMinute();

Schedule::command('telescope:prune --hours=48')->daily();
