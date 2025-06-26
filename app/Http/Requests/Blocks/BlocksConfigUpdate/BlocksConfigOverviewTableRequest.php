<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields\BlockConfigOverview;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields\BlockConfigRanking;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\BlockConfigTrend;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigOverviewTableRequest extends Data
{
    public function __construct(
        #[Required, StringType, Max(255)]
        public string $title,

        #[Required, StringType]
        public string $description,

        #[Required, StringType]
        public string $dataTableId,

        #[Required, StringType]
        public string $subsetGroupId,

        public ?string $defaultDate,

        public ?BlockConfigRanking $ranking,
        public ?BlockConfigTrend $trend,
        public ?BlockConfigOverview $overview,
    ) {}
}
