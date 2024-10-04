<?php

use App\Services\DataLoader\ScheduledQuery\StartScheduledJobs;
use Illuminate\Support\Facades\Process;

Schedule::call(function (#[\Illuminate\Container\Attributes\Config('app.vpn_password')] ?string $password) {
    Log::info('Running scheduled job');
    Log::info($password);
    $result = Process::run('snx -d');
    sleep(5);
    Log::info('disconnected');
    Log::info($result->output());
    $result = Process::run("echo $password | snx -s 125.17.229.163 -u xocortx");
    Log::info('result');
    Log::info($result->output());
})->everyMinute();

Schedule::call(function () {
    $runScheduleQuery = new StartScheduledJobs;
    $runScheduleQuery->run();
})->everyMinute();

Schedule::command('telescope:prune --hours=48')->daily();
