<?php

namespace App\Console\TemplateGenerator;

use App\Console\Commands\CrudStart;
use Illuminate\Support\Facades\File;

class GenerateFormRequest
{
    public function __construct(
        private readonly CrudStart $crudStart,
        private readonly string $basePath,
        private readonly string $directory,
        private readonly string $model
    ) {}

    public function generate(): void
    {

        //generate form request
        $formRequestPath = $this->basePath.'/app/Http/Requests/'
            .ucfirst($this->directory).'/';
        $this->crudStart->line('creating form request file: '.$formRequestPath);

        if (! File::exists($formRequestPath)) {
            File::makeDirectory($formRequestPath, 0755, true);
        }

        if (! File::exists($formRequestPath.ucfirst($this->model).'FormRequest.php')) {
            $formRequestContent = File::get($this->basePath.'/app/Console/TemplateGenerator/stubs/form-request.txt');

            $formRequestContent = str_replace('#[ModelName]', ucfirst($this->model), $formRequestContent);
            $formRequestContent = str_replace('#[Directory]', ucfirst($this->directory), $formRequestContent);

            File::put($formRequestPath.ucfirst($this->model).'FormRequest.php', $formRequestContent);

        } else {
            $this->crudStart->line('Form request file already exists');
        }
    }
}
