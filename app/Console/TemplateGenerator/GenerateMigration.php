<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;
use Str;

class GenerateMigration
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

        $modelDirectoryPath = $this->basePath.'/database/migrations/';

        $this->crudStart->line('Creating migration file on: '.$modelDirectoryPath);

        if (! File::exists($modelDirectoryPath)) {
            File::makeDirectory($modelDirectoryPath, 0755, true);
        }

        $fileName = date('Y_m_d_His').'_create_'.Str::snake(Str::plural(lcfirst($this->model))).'_table.php';

        if (! File::exists($modelDirectoryPath.$fileName)) {
            $formRequestContent = File::get($this->basePath.'/app/Console/TemplateGenerator/stubs/migration.txt');

            $formRequestContent = str_replace('#[ModelName]', ucfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[Directory]', ucfirst($this->directory), $formRequestContent);
            $formRequestContent = str_replace('#[modelName]', lcfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[modelNamePlural]', Str::plural(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[model_name]', Str::snake(lcfirst($this->model)), $formRequestContent);
            $formRequestContent = str_replace('#[url]', strtolower($this->url), $formRequestContent);

            File::put($modelDirectoryPath.$fileName, $formRequestContent);

        } else {
            $this->crudStart->line('Migration file already exists');
        }
    }
}
