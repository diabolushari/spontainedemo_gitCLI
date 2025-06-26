<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;


use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverview extends Data
{
    public function __construct(

        #[Max(255)]
        public string $title,

        public string $description,

        public string $cardType,

        public ?BlockConfigOverviewTable $overviewTable,

        public ?BlockConfigOverviewChart $overviewChart,


    ) {}
}
