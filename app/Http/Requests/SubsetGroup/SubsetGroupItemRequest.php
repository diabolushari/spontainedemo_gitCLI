<?php

namespace App\Http\Requests\SubsetGroup;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubsetGroupItemRequest extends Data
{
    public function __construct(
        public int $itemNumber,
        #[Exists('subset_details', 'id')]
        public int $subsetDetailId,
        #[Exists('subset_groups', 'id')]
        public int $subsetGroupId,
    ) {}
}
