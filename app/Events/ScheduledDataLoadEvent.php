<?php

namespace App\Events;

use App\Models\DataLoader\DataLoaderJob;
use Illuminate\Foundation\Events\Dispatchable;

class ScheduledDataLoadEvent
{
    use Dispatchable;

    public function __construct(
        public readonly DataLoaderJob $dataLoaderJob
    ) {}
}
