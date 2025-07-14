<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;


use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;



#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverview extends Data
{
    public function __construct(

        #[Max(255)]
        public ?string $title,

        public string $cardType,

    ) {}

    public static function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.max' => 'Title must be less than 255 characters',
            'card_type.required' => 'Card type is required',

        ];
    }
}
