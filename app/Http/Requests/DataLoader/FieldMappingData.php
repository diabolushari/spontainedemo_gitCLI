<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property FieldMappingData[] $children
 */
#[MapName(SnakeCaseMapper::class)]
class FieldMappingData extends Data
{
    public function __construct(
        public int $fieldId,
        #[Max(255)]
        public string $fieldName,
        #[Max(255)]
        public ?string $dataTableColumn,
        public ?string $fieldType,
        public array $children,
    ) {}
}
