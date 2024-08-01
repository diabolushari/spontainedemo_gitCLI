<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaDataFormRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $description,
        public int $metaStructureId,
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'meta_structure_id' => ['required', 'integer', 'exists:meta_structures,id'],
        ];
    }
}
