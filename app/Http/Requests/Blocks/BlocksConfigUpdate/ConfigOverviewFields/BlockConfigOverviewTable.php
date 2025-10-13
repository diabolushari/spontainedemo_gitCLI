<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\Arrayable;
use Spatie\LaravelData\DataCollection;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewTable extends Data
{
    public function __construct(

        public int $id,

        #[Max(255)]
        public string $title,

        public string $subsetId,

        public string $measureField,

        public bool $colSpan,

        #[DataCollectionOf(BlockConfigOverviewTableFilter::class)]
        public ?DataCollection $filters,


    ) {}
    public static function messages(): array
    {
        return [
            'title.required' => 'Please provide a title.',
            'subset_id.required' => 'Please provide a subset.',
            'measure_field.required' => 'Please provide a measure field.',
            'col_span.required' => 'Please provide a col span.',
            'filters.required' => 'Please provide a filters.',

        ];
    }
}
