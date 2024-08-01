<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaGroupAddItemRequest extends Data
{
    public function __construct(
        public int $metaGroupId,
        public int $metaDataId,
    ) {}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'meta_group_id' => ['required', 'integer', 'exists:meta_groups,id'],
            'meta_data_id' => ['required', 'integer', 'exists:meta_data,id'],
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public static function messages(): array
    {
        return [
            'meta_group_id.required' => 'Meta group is required',
            'meta_group_id.integer' => 'Meta group must be an integer',
            'meta_group_id.exists' => 'Meta group does not exist',
            'meta_data_id.required' => 'Meta data is required',
            'meta_data_id.integer' => 'Meta data  must be an integer',
            'meta_data_id.exists' => 'Meta data does not exist',
        ];
    }
}
