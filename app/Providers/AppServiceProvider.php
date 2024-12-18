<?php

namespace App\Providers;

use App\Events\ScheduledDataLoadEvent;
use App\Listeners\ScheduledDataLoadListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Event::listen(
        //     ScheduledDataLoadEvent::class,
        //     ScheduledDataLoadListener::class
        // );
        if (config('app.url') !== 'http://localhost:8000') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }
    }
}
