<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;

#[MapName(SnakeCaseMapper::class)]
class AxisDataField extends Data
{
    public function __construct(
        
        #[Required]
        #[Max(50)]
        public string $label,

        #[Required]
        #[Max(50)]
        public string $value,

        #[Required]
        public bool $showLabel,
    ) {}
}
