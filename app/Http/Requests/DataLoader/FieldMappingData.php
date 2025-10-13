<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class FieldMappingData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $column,
        #[Max(255)]
        public string $fieldName,
        #[In(['date', 'dimension', 'measure', 'text', 'relation'])]
        public string $fieldType,
        #[Max(500)]
        public ?string $jsonFieldPath,
        #[Max(255)]
        public ?string $dateFormat,
    ) {}
}
