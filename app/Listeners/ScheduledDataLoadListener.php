<?php

namespace App\Listeners;

use App\Events\ScheduledDataLoadEvent;
use App\Services\DataLoader\Query\RunScheduledJob;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class ScheduledDataLoadListener implements ShouldQueue
{
    public function __construct(
        private readonly RunScheduledJob $job,
    ) {}

    /**
     * @throws Exception
     */
    public function handle(ScheduledDataLoadEvent $event): void
    {
        Log::info('Scheduled data load event received');
        $event->dataLoaderJob->load('loaderQuery.loaderConnection', 'detail');
        $this->job->run($event->dataLoaderJob);
    }
}
