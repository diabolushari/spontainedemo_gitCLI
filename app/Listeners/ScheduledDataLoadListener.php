<?php

namespace App\Listeners;

use App\Events\ScheduledDataLoadEvent;
use App\Services\DataLoader\Query\RunScheduledJob;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;

class ScheduledDataLoadListener implements ShouldQueue
{

    public $queue = '1stop';

    public function __construct(
        private readonly RunScheduledJob $job,
    ) {}

    /**
     * @throws Exception
     */
    public function handle(ScheduledDataLoadEvent $event): void
    {

        $event->dataLoaderJob->load('loaderQuery.loaderConnection', 'detail');
        $this->job->run($event->dataLoaderJob);
    }
}
