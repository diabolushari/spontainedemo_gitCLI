<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;
use Str;

class GenerateUIFiles
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
        $uiDirectoryPath = $this->basePath.'/resources/js/Pages/'
            .ucfirst($this->directory).'/';

        $this->crudStart->line('Creating UI files on: '.$uiDirectoryPath);

        if (! File::exists($uiDirectoryPath)) {
            File::makeDirectory($uiDirectoryPath, 0755, true);
        }

        $showFile = $uiDirectoryPath.ucfirst($this->model).'Show.tsx';
        $editFile = $uiDirectoryPath.ucfirst($this->model).'Edit.tsx';
        $createFile = $uiDirectoryPath.ucfirst($this->model).'Create.tsx';
        $indexFile = $uiDirectoryPath.ucfirst($this->model).'Index.tsx';

        $files = [
            [
                'file' => $showFile,
                'stub' => 'show.txt',
            ],
            [
                'file' => $editFile,
                'stub' => 'edit.txt',
            ],
            [
                'file' => $createFile,
                'stub' => 'create.txt',
            ],
            [
                'file' => $indexFile,
                'stub' => 'index.txt',
            ],
        ];

        foreach ($files as $file) {
            if (! File::exists($file['file'])) {
                $formRequestContent = File::get($this->basePath.'/app/Console/TemplateGenerator/stubs/'.$file['stub']);

                $formRequestContent = str_replace('#[ModelName]', ucfirst($this->model), $formRequestContent);
                $formRequestContent = str_replace('#[Directory]', ucfirst($this->directory), $formRequestContent);
                $formRequestContent = str_replace('#[modelName]', lcfirst($this->model), $formRequestContent);
                $formRequestContent = str_replace('#[modelNamePlural]', Str::plural(lcfirst($this->model)), $formRequestContent);
                $formRequestContent = str_replace('#[model_name]', Str::snake(lcfirst($this->model)), $formRequestContent);
                $formRequestContent = str_replace('#[url]', strtolower($this->url), $formRequestContent);

                File::put($file['file'], $formRequestContent);

            } else {
                $this->crudStart->line('Ui File '.$file['file'].' already exists');
            }
        }
    }
}
