<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataClassificationPropertyFormRequest extends Data
{
    public function __construct(
        public string $propertyType,
        public string $propertyValue,
        public int $order,
    ) {
    }

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'property_type' => ['required', 'string', 'max:255'],
            'property_value' => ['required', 'string', 'max:255'],
            'order' => ['required', 'integer'],
        ];
    }
}
