<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Data;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigMeasureField extends Data
{
    public function __construct(
        public string $field,
        public string $label,
        public bool $showLabel,
    ) {}

    public static function messages(): array
    {
        return [
            'value.required' => 'Please provide a value.',
            'label.required' => 'Please provide a label.',
            'unit.required' => 'Please provide a unit.',
            'show_label.required' => 'Please specify if the label should be shown.',
        ];
    }
}
