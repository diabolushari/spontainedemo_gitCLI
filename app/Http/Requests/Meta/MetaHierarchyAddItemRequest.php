<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaHierarchyAddItemRequest extends Data
{
    public function __construct(
        #[Exists('meta_hierarchies', 'id')]
        public int $metaHierarchyId,
        #[Exists('meta_hierarchy_items', 'id')]
        public ?int $parentId,
        #[Exists('meta_data', 'id')]
        public int $primaryFieldId,
        #[Exists('meta_data', 'id')]
        public ?int $secondaryFieldId,
    ) {}
}
