<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigTrend extends Data
{
    public function __construct(
        #[Exists('subset_group_items', 'subset_detail_id')]
        public int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        public string $color,

        public string $chartType,

        #[RequiredWith('subset_id')]
        public ?DataFieldGroup $dataField,

        #[RequiredWith('subset_id')]
        public ?TooltipFieldData $tooltipField

    ) {}
}
