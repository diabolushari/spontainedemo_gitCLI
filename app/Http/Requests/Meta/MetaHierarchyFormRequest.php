<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaHierarchyFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Max(1000)]
        public ?string $description,
        #[Regex('/^[a-zA-Z0-9\s]*$/')]
        public string $primaryFieldName,
        #[Regex('/^[a-zA-Z0-9\s]*$/')]
        public ?string $secondaryFieldName,
        public ?string $defaultHeirarchy,
        /**
         * @var array<array{
         *     level:int,
         *     name: string|null,
         *     primary_field_structure_id: int,
         *     secondary_field_structure_id: int|null
         * }>
         */
        public array $hierarchyLevelInfos,
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'hierarchy_level_infos' => ['array', 'nullable'],
            'hierarchy_level_infos.*.level' => ['required', 'integer', 'min:1'],
            'hierarchy_level_infos.*.name' => ['required', 'string', 'max:255'],
            'hierarchy_level_infos.*.primary_field_structure_id' => ['required', 'integer', 'exists:meta_structures,id'],
            'hierarchy_level_infos.*.secondary_field_structure_id' => ['nullable', 'integer', 'exists:meta_structures,id'],
        ];
    }

    public static function messages(): array
    {
        return [
            'hierarchy_level_infos.*.name.required' => 'Name Field is required',
            'hierarchy_level_infos.*.primary_field_structure_id.required' => 'Primary Field  is required',
            'hierarchy_level_infos.*.primary_field_structure_id.exists' => 'Value Of Primary Field is not valid',
            'hierarchy_level_infos.*.secondary_field_structure_id.exists' => 'Value Of Secondary Field is not valid',
        ];
    }
}
