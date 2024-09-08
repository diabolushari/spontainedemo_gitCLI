<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;
use Str;

class GenerateController
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

        //generate form request
        $controllerDirectoryPath = $this->basePath.'/app/Http/Controllers/'
            .ucfirst($this->directory).'/';

        $this->crudStart->line('Creating controller file on: '.$controllerDirectoryPath);

        if (! File::exists($controllerDirectoryPath)) {
            File::makeDirectory($controllerDirectoryPath, 0755, true);
        }

        if (! File::exists($controllerDirectoryPath.ucfirst($this->model).'Controller.php')) {
            $formRequestContent = File::get($this->basePath.'/app/Console/TemplateGenerator/stubs/controller.txt');

            $formRequestContent = str_replace('#[ModelName]', ucfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[Directory]', ucfirst($this->directory), $formRequestContent);
            $formRequestContent = str_replace('#[modelName]', lcfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[modelNamePlural]', Str::plural(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[model_name]', Str::snake(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[url]', strtolower($this->url), $formRequestContent);

            File::put($controllerDirectoryPath.ucfirst($this->model).'Controller.php', $formRequestContent);

        } else {
            $this->crudStart->line('Form request file already exists');
        }
    }
}
