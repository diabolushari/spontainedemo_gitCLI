<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields\BlockConfigOverviewTable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;


#[MapName(SnakeCaseMapper::class)]
class BlocksConfigOverviewTableRequest extends Data
{
    public function __construct(
        public BlockConfigOverviewTable $overview_table,

    ) {}
}
