<?php

namespace App\Listeners;

use App\Events\ScheduledDataLoadEvent;
use App\Services\DataLoader\Query\RunScheduledJob;
use Exception;
use Illuminate\Support\Facades\Log;

class ScheduledDataLoadListener
{
    public function __construct(
        private readonly RunScheduledJob $job,
    ) {}

    /**
     * @throws Exception
     */
    public function handle(ScheduledDataLoadEvent $event): void
    {

        $event->dataLoaderJob->load('loaderQuery.loaderConnection', 'detail');
        $result = $this->job->run($event->dataLoaderJob);
        Log::info('operation result: '.json_encode($result));
    }
}
