<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaHierarchyDeleteItemRequest extends Data
{
    public function __construct(
        public int $metaHierarchyId,
        public ?int $parentId,
        public int $metaDataId,
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'meta_data_id' => ['required', 'integer', 'exists:meta_data,id'],
            'parent_id' => ['nullable',  'integer', 'exists:meta_data,id'],
            'meta_hierarchy_id' => ['required', 'integer', 'exists:meta_hierarchies,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function messages(): array
    {

        return [
            'meta_data_id.exists' => 'New Node does not exist.',
            'meta_hierarchy_id.exists' => 'Meta Hierarchy does not exist.',
            'parent_id.exists' => 'Parent does not exist.',
            'meta_data_id.required' => 'Meta Data Field is required.',
            'meta_hierarchy_id.required' => 'Meta Hierarchy Field is required.',
        ];

    }
}
