<?php

namespace App\Http\Requests\Subset;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property SubsetDateField[] $dates
 * @property SubsetDimensionField[] $dimensions
 * @property SubsetMeasureField[] $measures
 */
#[MapName(SnakeCaseMapper::class)]
class SubsetFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Max(5000)]
        public ?string $description,
        public ?int $maxRowsToFetch,
        public bool $groupData,
        #[Max(255)]
        public string $type,
        public bool $useForTrainingAi,
        #[Max(5000)]
        public ?string $proactiveInsightInstructions,
        #[Max(5000)]
        public ?string $visualizationInstructions,
        public ?array $dates,
        public ?array $dimensions,
        public ?array $measures,
        public string $heirarchy,
    ) {}
}
