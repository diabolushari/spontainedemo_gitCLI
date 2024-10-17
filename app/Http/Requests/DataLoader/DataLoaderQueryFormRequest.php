<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataLoaderQueryFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string $name,
        #[Max(1000)]
        public readonly ?string $description,
        #[Max(10000)]
        public readonly string $query,
        #[Exists('loader_connections', 'id')]
        public readonly int $connectionId,
    ) {}
}
