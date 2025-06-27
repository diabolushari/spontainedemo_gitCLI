<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewTable extends Data
{
    public function __construct(

        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[RequiredWith('subset_id')]
        public ?string $dimensionField,

        public ?string $measureFieldDimension,

        public ?int $gridNumber,

        public ?bool $showTotal,

        public ?string $order,

        #[RequiredWith('subset_id')]
        #[DataCollectionOf(BlockConfigMeasureField::class)]
        public ?DataCollection $measureField,


    ) {}
    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title when a subset is selected.',
            'dimension_field.required_with' => 'Please select a dimension field.',
            'measure_field.required_with' => 'Please select a measure field.',
            'grid_number.required_with' => 'Please select a grid number.',
            'show_total.required_with' => 'Please specify if total should be shown.',
            'overview.overview_table.measure_field.required_with' => 'Please select a measure field.',
            'measure_field.label.required' => 'Please enter a label for the measure field.',
            'measure_field.label.string' => 'Measure field label must be a string.',
            'measure_field.value.required' => 'Please enter a value for the measure field.',
            'measure_field.value.string' => 'Measure field value must be a string.',
            'order.required_with' => 'Please select an order.',
        ];
    }
}
