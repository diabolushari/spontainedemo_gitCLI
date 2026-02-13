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
    public function register(): void
    {
        $this->app->bind(
            \App\Services\Embedding\EmbeddingServiceInterface::class,
            \App\Services\Embedding\OpenAIEmbeddingService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Event::listen(
        //     ScheduledDataLoadEvent::class,
        //     ScheduledDataLoadListener::class
        // );
        if (config('app.url') !== 'http://localhost:8000' && config('app.url') !== 'http://1stopkseb.xocortx.com') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }
    }
}
