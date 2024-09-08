<?php

namespace App\Console\TemplateGenerator;

use Illuminate\Support\Facades\File;

class InsertNewTypeDefinition
{
    public function __construct(
        private readonly string $model
    ) {}

    public function generate(): void
    {
        $content = 'export interface '.ucfirst($this->model).' extends Model {}';

        File::append('resources/js/interfaces/data_interfaces.tsx', $content);
    }
}
