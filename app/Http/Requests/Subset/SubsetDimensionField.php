<?php

namespace App\Http\Requests\Subset;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property int[]|null $filters
 */
#[MapName(SnakeCaseMapper::class)]
class SubsetDimensionField extends Data
{
    public function __construct(
        public ?int $id,
        public int $fieldId,
        public int $filterOnly,
        public string $subsetFieldName,
        public string $subsetColumn,
        public ?string $description,
        public ?int $hierarchyId,
        public ?string $sortOrder,
        public ?string $columnExpression,
        public ?array $filters,
    ) {}
}
