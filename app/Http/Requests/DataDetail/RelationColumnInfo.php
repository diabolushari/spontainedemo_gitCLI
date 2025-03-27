<?php

namespace App\Http\Requests\DataDetail;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class RelationColumnInfo extends Data
{
    public function __construct(
        public string $column,
        public string $fieldName,
        public int $relatedTableId,
    ) {}
}
