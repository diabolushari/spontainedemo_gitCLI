<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
#[MapName(SnakeCaseMapper::class)]
class RankingDataField extends Data
{
    public function __construct(

        #[Required]
        #[Max(50)]
        public ?string $label,

        #[Required]
        #[Max(50)]
        public ?string $value,

        #[Required]
        public ?bool $showLabel,
    ) {}
}

