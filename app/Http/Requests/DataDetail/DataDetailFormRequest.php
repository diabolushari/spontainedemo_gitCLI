<?php

namespace App\Http\Requests\DataDetail;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property DateColumnInfo[] $dates
 * @property DimensionColumnInfo[] $dimensions
 * @property MeasureColumnInfo[] $measures
 * @property TextColumnInfo[] $texts
 * @property RelationColumnInfo[] $relations
 */
#[MapName(SnakeCaseMapper::class)]
class DataDetailFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Max(1000)]
        public ?string $description,
        #[Max(255)]
        public string $subjectArea,
        #[Max(255)]
        public string $tableName,
        public bool $isActive,
        public ?array $dates,
        public ?array $dimensions,
        public ?array $measures,
        public ?array $texts,
        public ?array $relations,
    ) {}
}
