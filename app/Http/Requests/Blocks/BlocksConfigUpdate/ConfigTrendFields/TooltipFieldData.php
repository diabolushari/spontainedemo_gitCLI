<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TooltipFieldData extends Data
{
    public function __construct(
        #[Required]
        #[Max(50)]
        public string $label,

        #[Required]
        #[Max(50)]
        public string $unit,

        #[Required]
        public bool $showLabel,
    ) {}

    public static function messages(): array
    {
        return [
            'label.required_with' => 'Tooltip label is required when a subset is selected.',
            'unit.required_with' => 'Tooltip unit is required when a subset is selected.',
            'show_label.required_with' => 'Please choose whether to show the tooltip label.',
        ];
    }
}
