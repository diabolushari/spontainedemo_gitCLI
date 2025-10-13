<?php

namespace App\Http\Requests\Blocks\DataExplorer;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataExplorerFormRequest extends Data
{
    public function __construct(

        public string $title,

        public ?string $description,

        public int $subsetGroupId,

        public int $defaultSubsetId,

        public int $dataTableId,

        public string $defaultView,
    ) {}
}
