<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields\RankingDataField;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigRanking extends Data
{
    public function __construct(
        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[RequiredWith('subset_id')]
        public ?RankingDataField $dataField,
    ) {}

    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title when a subset is selected.',
            'data_field.required_with' => 'You must select fields to plot the ranking.',
            'data_field.label.required' => 'Please enter a label for the ranking.',
            'data_field.label.string' => 'Ranking label must be a string.',
            'data_field.value.required' => 'Please enter a value for the ranking.',
            'data_field.value.string' => 'Ranking value must be a string.',
        ];
    }
}
