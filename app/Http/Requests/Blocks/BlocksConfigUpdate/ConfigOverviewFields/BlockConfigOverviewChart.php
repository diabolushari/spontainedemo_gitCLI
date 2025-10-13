<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewChart extends Data
{
    public function __construct(

        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[Max(255)]
        public ?string $discription,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $chartType,

        #[RequiredWith('subset_id')]
        #[DataCollectionOf(BlockConfigDimensionField::class)]
        public ?DataCollection $dimensions,

        #[RequiredWith('subset_id')]
        #[DataCollectionOf(BlockConfigMeasureField::class)]
        public ?DataCollection $measures,


    ) {}

    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title.',
            'chart_type.required_with' => 'Please select a chart type.',
            'dimensions.required_with' => 'Please select a dimension.',
            'measures.required_with' => 'Please select a measure.',
        ];
    }
}
