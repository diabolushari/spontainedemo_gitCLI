<?php

namespace App\Http\Requests\Subset;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubsetTextField extends Data
{
    public function __construct(
        public ?int $id,
        public int $fieldId,
        public string $subsetFieldName,
        public string $subsetColumn,
        public ?string $sortOrder,
        public ?string $expression,
        public ?string $description,
    ) {}
}
