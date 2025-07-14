<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\BlockConfigTrend;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class BlocksConfigTrendUpdateRequest extends Data
{
    public function __construct(
        #[Required]
        public BlockConfigTrend $trend,
    ) {}
    public static function messages(): array
    {
        return [
            'trend.title.required' => 'Please provide a title.',
            'trend.title.max' => 'Title must be less than 255 characters',
            'trend.title.string' => 'Title required',
            'trend.title.required_with' => 'Please provide a title.',
            // Tooltip related — fix key path from tooltip_field ➜ tooltip
            'trend.tooltip_field.label.required' => 'Please enter a tooltip label.',
            'trend.tooltip_field.label.string' => 'Tooltip label must be a string.',
            'trend.tooltip_field.unit.required' => 'Please enter a tooltip unit.',
            'trend.tooltip_field.unit.string' => 'Tooltip unit must be a string.',
            'trend.tooltip_field.show_label.required' => 'Please specify if tooltip label should be shown.',

            // DataFieldGroup -> y_axis and x_axis fields
            'trend.data_field.y_axis.label.required' => 'Y-axis label is required.',
            'trend.data_field.y_axis.label.string' => 'Y-axis label must be a string.',
            'trend.data_field.y_axis.value.required' => 'Y-axis value is required.',
            'trend.data_field.y_axis.value.string' => 'Y-axis value must be a string.',

            'trend.data_field.x_axis.label.required' => 'X-axis label is required.',
            'trend.data_field.x_axis.value.required' => 'X-axis value is required.',
        ];
    }
}
