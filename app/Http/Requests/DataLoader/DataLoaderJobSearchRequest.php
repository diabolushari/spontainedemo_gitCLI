<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataLoaderJobSearchRequest extends Data
{
    public function __construct(
        public readonly ?string $search,
    ) {}
}
