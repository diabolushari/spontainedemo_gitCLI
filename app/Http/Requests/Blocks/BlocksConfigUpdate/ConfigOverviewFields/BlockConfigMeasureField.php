<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Data;

class BlockConfigMeasureField extends Data
{
    public function __construct(
        public string $value,
        public string $label,
        public string $unit,
        public bool $show_label,
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
