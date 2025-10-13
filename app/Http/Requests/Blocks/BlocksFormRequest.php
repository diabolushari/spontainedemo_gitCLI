<?php

namespace App\Http\Requests\Blocks;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksFormRequest extends Data
{
    public function __construct(
        #[Required, StringType, Max(255)]
        public string $name,

        #[Required, IntegerType]
        public int $position,

        #[Required, ArrayType]
        public array $dimensions,

        #[Required, IntegerType, Exists('pages', 'id')]
        public int $pageId,

        #[StringType, In(['up', 'down'])]
        public ?string $action = null

    ) {}
}
