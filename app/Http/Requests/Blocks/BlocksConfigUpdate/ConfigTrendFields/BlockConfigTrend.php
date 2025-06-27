<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\DataFieldGroup;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\TooltipFieldData;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigTrend extends Data
{
    public function __construct(
        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[RequiredWith('subset_id')]
        public ?DataFieldGroup $dataField,

        #[RequiredWith('subset_id')]
        public ?TooltipFieldData $tooltipField

    ) {}
    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title when a subset is selected.',

        ];
    }
}
