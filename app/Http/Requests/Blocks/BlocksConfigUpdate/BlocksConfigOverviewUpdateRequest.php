<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields\BlockConfigRanking;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\BlockConfigTrend;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigOverviewUpdateRequest extends Data
{
    public function __construct(
        #[Required, StringType, Max(255)]
        public string $title,

        #[Required, StringType]
        public string $description,

        #[Required]
        public string $cardType,
    ) {}
}
