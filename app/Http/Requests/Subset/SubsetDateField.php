<?php

namespace App\Http\Requests\Subset;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubsetDateField extends Data
{
    public function __construct(
        public int $fieldId,
        public int $useDynamicDate,
        public int $useLastFoundData,
        public ?string $dateFieldExpression,
        public ?string $startDate,
        public ?string $endDate,
        public ?string $dynamicStartType,
        public ?string $dynamicEndType,
        public ?int $dynamicStartOffset,
        public ?int $dynamicEndOffset,
        public ?string $dynamicStartUnit,
        public ?string $dynamicEndUnit,
    ) {}
}
