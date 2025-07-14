<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields\BlockConfigOverview;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigGeneralUpdateRequest extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $title,

        #[Required, Max(1000)]
        public string $description,

        #[Required, Exists('data_details', 'id')]
        public int $dataTableId,

        #[Required, Exists('subset_groups', 'id')]
        public int $subsetGroupId,

        public string $defaultView,

        public bool $trendSelected,

        public bool $rankingSelected,

        #[BooleanType]
        public bool $overviewSelected,

        #[Nullable, RequiredIf('overviewSelected', true)]
        public ?BlockConfigOverview $overview,
    ) {}
}
