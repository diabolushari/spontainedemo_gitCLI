<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class HierarchyByLevelSearchRequest extends Data
{
    public function __construct(
        public ?string $search,
        public ?int $hierarchy,
        public ?string $currentMetaDataId,
    ) {}
}
