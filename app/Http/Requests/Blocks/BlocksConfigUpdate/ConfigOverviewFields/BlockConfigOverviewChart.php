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
        #[RequiredWith('subset_id')]
        public ?string $chartType,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $colorScheme,

        #[RequiredWith('subset_id')]
        #[Max(255)]
        public ?string $xAxisLabel,

        #[RequiredWith('subset_id')]
        #[Max(255)]
        public ?string $xAxis,

        #[RequiredWith('subset_id')]
        public ?bool $xAxisEnable,

        #[RequiredWith('subset_id')]
        #[Min(0)]
        #[Max(100)]
        public ?int $xAxisCount,

        #[RequiredWith('subset_id')]
        #[Max(255)]
        public ?string $xAxisOrder,

        #[RequiredWith('subset_id')]
        #[DataCollectionOf(BlockConfigMeasureField::class)]
        public ?DataCollection $yAxis,


    ) {}

    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title.',
            'chart_type.required_with' => 'Please select a chart type.',
            'color_scheme.required_with' => 'Please select a color scheme.',
            'x_axis_label.required_with' => 'Please enter a label for the x axis.',
            'x_axis.required_with' => 'Please enter a value for the x axis.',
            'x_axis_enable.required_with' => 'Please specify if x axis should be enabled.',
            'x_axis_count.required_with' => 'Please select a count for the x axis.',
            'x_axis_order.required_with' => 'Please select an order for the x axis.',
            'y_axis.required_with' => 'Please select a y axis.',
        ];
    }
}
