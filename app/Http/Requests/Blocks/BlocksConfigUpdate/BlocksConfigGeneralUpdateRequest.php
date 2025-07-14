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

    public static function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.max' => 'Title must be less than 255 characters',
            'title.string' => 'Title required',
            'description.required' => 'Description is required',
            'description.max' => 'Description must be less than 1000 characters',
            'description.string' => 'Description required',
            'data_table_id.required' => 'Data table is required',
            'data_table_id.exists' => 'Data table does not exist',
            'data_table_id.numeric' => 'Data table required',
            'subset_group_id.required' => 'Subset group is required',
            'subset_group_id.exists' => 'Subset group does not exist',
            'subset_group_id.numeric' => 'Subset group required',
            'defaultView.required' => 'Default view is required',
            'defaultView.in' => 'Default view is invalid',
            'trendSelected.required' => 'Trend selected is required',
            'rankingSelected.required' => 'Ranking selected is required',
            'overviewSelected.required' => 'Overview selected is required',
            'overviewSelected.boolean' => 'Overview selected must be a boolean',
            'overview.required_if' => 'Overview is required',
        ];
    }
}
