<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaHierarchyFormRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $description,
        /**
         * @var array<array{level:int,meta_structure_id:string}>
         */
        public array $hierarchyLevelInfos,
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'hierarchy_level_info' => ['array', 'nullable'],
            'hierarchy_level_info.*.level' => ['required', 'integer', 'min:1'],
            'hierarchy_level_info.*.meta_structure_id' => ['required', 'integer', 'exists:meta_structures,id'],
        ];
    }
}
