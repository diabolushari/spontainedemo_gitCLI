<?php

namespace App\Http\Requests\SubsetGroup;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubsetGroupFormRequest extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $description,
    ) {}
}
