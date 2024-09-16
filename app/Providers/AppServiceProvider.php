<?php

namespace App\Providers;

use App\Events\ScheduledDataLoadEvent;
use App\Listeners\ScheduledDataLoadListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            ScheduledDataLoadEvent::class,
            ScheduledDataLoadListener::class
        );
    }
}
