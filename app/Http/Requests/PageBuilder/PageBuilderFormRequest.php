<?php

namespace App\Http\Requests\PageBuilder;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class PageBuilderFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $title,
        #[Max(1000)]
        public string $description,
        #[Date]
        public string $publishedAt,
        public string $url
    ) {}
}
