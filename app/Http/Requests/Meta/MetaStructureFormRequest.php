<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaStructureFormRequest extends Data
{
    public function __construct(
        public string $structureName,
        public ?string $description,
        public ?int $dataClassificationLevel,
        public ?int $dataCategory,
        public ?int $encryption,
        public ?int $accessLevel,
        public ?int $dataOwner,
    ) {
    }

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'structure_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'data_classification_level' => ['nullable', 'integer', 'exists:data_classification_properties,id'],
            'data_category' => ['nullable', 'integer', 'exists:data_classification_properties,id'],
            'encryption' => ['nullable', 'integer', 'exists:data_classification_properties,id'],
            'access_level' => ['nullable', 'integer', 'exists:data_classification_properties,id'],
            'data_owner' => ['nullable', 'integer', 'exists:data_classification_properties,id'],
        ];
    }
}
