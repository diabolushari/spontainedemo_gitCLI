<?php

namespace App\Http\Requests\Blocks;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksUpdateFormRequest extends Data
{
    public function __construct(
        #[StringType, Max(255)]
        public ?string $name,

        #[IntegerType]
        public ?int $position,

        #[ArrayType]
        public ?array $dimensions,

        #[IntegerType, Exists('pages', 'id')]
        public ?int $page_id,

        #[StringType, In(['up', 'down'])]
        public ?string $action = null


    ) {}
}
