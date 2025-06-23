<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields\BlockConfigOverviewChart;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;


#[MapName(SnakeCaseMapper::class)]
class BlocksConfigOverviewChartUpdateRequest extends Data
{
    public function __construct(

        public ?BlockConfigOverviewChart $overviewChart,

    ) {}
}
