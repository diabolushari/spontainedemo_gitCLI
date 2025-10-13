<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigGeneralUpdateRequest extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $title,

        #[Required, Max(1000)]
        public string $subtitle,

        #[Required, Exists('data_details', 'id')]
        public int $dataTableId,

        #[Required, Exists('subset_groups', 'id')]
        public int $subsetGroupId,

    ) {}

    public static function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.max' => 'Title must be less than 255 characters',
            'title.string' => 'Title required',
            'subtitle.required' => 'Subtitle is required',
            'subtitle.max' => 'Subtitle must be less than 1000 characters',
            'subtitle.string' => 'Subtitle required',
            'data_table_id.required' => 'Data table is required',
            'data_table_id.exists' => 'Data table does not exist',
            'data_table_id.numeric' => 'Data table required',
            'subset_group_id.required' => 'Subset group is required',
            'subset_group_id.exists' => 'Subset group does not exist',
            'subset_group_id.numeric' => 'Subset group required',

        ];
    }
}
