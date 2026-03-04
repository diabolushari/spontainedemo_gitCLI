<?php

namespace App\Services\DataLoader\ScheduledQuery;

use App\Events\ScheduledDataLoadEvent;
use App\Models\DataLoader\DataLoaderJob;
use App\Services\DataLoader\CronTypes;
use Carbon\Carbon;

class StartScheduledJobs
{
    public Carbon $now;

    public function __construct()
    {
        $this->now = Carbon::now();
    }

    public function run(): void
    {
        $this->runSubHourQueries();
        // if ($this->now->minute == 0) {
            $this->runHourlyQueries();
        // }
        $this->runDailyQueries($this->now->toTimeString());
        $this->runWeeklyQueries($this->now->toTimeString(), $this->now->dayName);
        $this->runMonthlyQueries($this->now->toTimeString(), $this->now->day);
        $this->runYearlyQueries($this->now->toTimeString(), $this->now->month, $this->now->day);
    }

    private function runSubHourQueries(): void
    {
        DataLoaderJob::where('cron_type', CronTypes::SUB_HOUR)
            ->active()
            ->whereNotNull('schedule_start_time')
            ->whereNotNull('sub_hour_interval')
            ->get()
            ->each(function ($query) {
                $startTime = Carbon::createFromTimeString($query->schedule_start_time);

                if ($startTime->greaterThan($this->now)) {
                    return;
                }

                $minutesDifference = $startTime->diffInMinutes($this->now, false);

                if ($minutesDifference >= 0 && $minutesDifference % $query->sub_hour_interval === 0) {
                    ScheduledDataLoadEvent::dispatch($query);
                }
            });
    }

    private function runHourlyQueries(): void
    {
        DataLoaderJob::where('cron_type', CronTypes::HOURLY)
            ->active()
            ->get()
            ->each(function ($query) {
                ScheduledDataLoadEvent::dispatch($query);
            });
    }

    private function runDailyQueries(string $time): void
    {
        DataLoaderJob::where('cron_type', CronTypes::DAILY)
            ->active()
            ->where('schedule_time', $time)
            ->get()
            ->each(function ($query) {
                ScheduledDataLoadEvent::dispatch($query);
            });
    }

    private function runWeeklyQueries(string $time, string $dayOfWeek): void
    {
        DataLoaderJob::where('cron_type', CronTypes::WEEKLY)
            ->active()
            ->where('schedule_time', $time)
            ->where('day_of_week', $dayOfWeek)
            ->get()
            ->each(function ($query) {
                ScheduledDataLoadEvent::dispatch($query);
            });
    }

    private function runMonthlyQueries(string $time, int $dayOfMonth): void
    {
        DataLoaderJob::where('cron_type', CronTypes::MONTHLY)
            ->active()
            ->where('schedule_time', $time)
            ->where('day_of_month', $dayOfMonth)
            ->get()
            ->each(function ($query) {
                ScheduledDataLoadEvent::dispatch($query);
            });
    }

    private function runYearlyQueries(string $time, int $monthOfYear, int $dayOfMonth): void
    {
        DataLoaderJob::where('cron_type', CronTypes::YEARLY)
            ->active()
            ->where('schedule_time', $time)
            ->where('month_of_year', $monthOfYear)
            ->where('day_of_month', $dayOfMonth)
            ->get()
            ->each(function ($query) {
                ScheduledDataLoadEvent::dispatch($query);
            });
    }
}
