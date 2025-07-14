<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewTableFilter extends Data
{
    public function __construct(
        #[StringType, Max(255)]
        public string $dimension,

        #[StringType, Max(255)]
        public string $operator,

        #[StringType, Max(255)]
        public string $value,
    ) {}
    public static function messages(): array
    {
        return [
            'dimension.required' => 'Please provide a dimension.',
            'operator.required' => 'Please provide an operator.',
            'value.required' => 'Please provide a value.',
        ];
    }
}
