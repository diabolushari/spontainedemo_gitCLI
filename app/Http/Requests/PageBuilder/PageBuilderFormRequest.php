<?php

namespace App\Http\Requests\PageBuilder;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class PageBuilderFormRequest extends Data
{
    public function __construct(
        public string $title,
        public string $description,
        public string $date,
        public string $url
    ) {}
}
