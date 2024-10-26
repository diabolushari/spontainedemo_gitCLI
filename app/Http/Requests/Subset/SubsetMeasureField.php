<?php

namespace App\Http\Requests\Subset;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubsetMeasureField extends Data
{
    public function __construct(
        public int $fieldId,
        public ?string $aggregation,
        public ?string $expression,
        public ?int $weightFieldId,
    ) {}
}
