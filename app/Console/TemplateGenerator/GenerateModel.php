<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;
use Str;

class GenerateModel
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

        $modelDirectoryPath = $this->basePath.'/app/Models/'
            .ucfirst($this->directory).'/';

        $this->crudStart->line('Creating model file on: '.$modelDirectoryPath);

        if (! File::exists($modelDirectoryPath)) {
            File::makeDirectory($modelDirectoryPath, 0755, true);
        }

        if (! File::exists($modelDirectoryPath.ucfirst($this->model).'.php')) {
            $formRequestContent = File::get($this->basePath.'/app/Console/TemplateGenerator/stubs/model.txt');

            $formRequestContent = str_replace('#[ModelName]', ucfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[Directory]', ucfirst($this->directory), $formRequestContent);
            $formRequestContent = str_replace('#[modelName]', lcfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[modelNamePlural]', Str::plural(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[model_name]', Str::snake(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[url]', strtolower($this->url), $formRequestContent);

            File::put($modelDirectoryPath.ucfirst($this->model).'.php', $formRequestContent);

        } else {
            $this->crudStart->line('Model file already exists');
        }
    }
}
