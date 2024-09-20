<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class MetaHierarchyFormRequest extends Data
{
    /**
     * @var array{level:string ,heirarchy_name: string } $heirachy_array
     */
    public function __construct(
        public string $name,
        public ?string $description,
        public string $heirarchyLevel,
        public array $heirachyArray
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'heirarchy_level' => ['string', 'string', 'max:255'],
            'heirachy_array' => ['array' ]
        ];
    }
}
