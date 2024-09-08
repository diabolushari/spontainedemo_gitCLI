<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;
use Str;

class InsertNewRoute
{
    public function __construct(
        private readonly CrudStart $crudStart,
        private readonly string $basePath,
        private readonly string $directory,
        private readonly string $model,
        private readonly string $url
    ) {}

    public function generate(): void
    {

        $routeFilePath = $this->basePath.'/routes/web.php';

        $this->crudStart->line('Adding route to: '.$routeFilePath);

        if (! File::exists($routeFilePath)) {
            $this->crudStart->line('Route file does not exist');

            return;
        }

        $routeContent = File::get($routeFilePath);

        $urlName = implode(
            '',
            array_map(
                fn ($name) => ucfirst($name),
                explode('-', $this->url)
            )
        );

        $urlSingular = Str::singular($urlName);

        $snubContent = File::get($this->basePath.'app/Console/TemplateGenerator/stubs/route.txt');

        $snubContent = str_replace('#[ModelName]', ucfirst($this->model), $snubContent);
        $snubContent = str_replace('#[Directory]', ucfirst($this->directory), $snubContent);
        $snubContent = str_replace('#[url]', strtolower($this->url), $snubContent);
        $snubContent = str_replace('#[urlSingularSnake]', Str::snake($urlSingular), $snubContent);
        $snubContent = str_replace('#[urlSingular]', $urlSingular, $snubContent);

        $routeContent = "\n".$snubContent."\n".$routeContent."\n";

        File::put($routeFilePath, $routeContent);
    }
}
