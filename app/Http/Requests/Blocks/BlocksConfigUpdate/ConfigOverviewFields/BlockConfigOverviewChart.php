<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewChart extends Data
{
    public function __construct(

        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $chartType,

        #[RequiredWith('subset_id')]
        #[Max(255)]
        public ?string $xAxisLabel,

        #[RequiredWith('subset_id')]
        #[Max(255)]
        public ?string $xAxis,

        #[RequiredWith('subset_id')]
        public ?bool $xAxisEnable,

        #[RequiredWith('subset_id')]
        #[Min(0)]
        #[Max(100)]
        public ?int $xAxisCount,

        #[RequiredWith('subset_id')]
        #[DataCollectionOf(BlockConfigMeasureField::class)]
        public ?DataCollection $yAxis,


    ) {}
}
