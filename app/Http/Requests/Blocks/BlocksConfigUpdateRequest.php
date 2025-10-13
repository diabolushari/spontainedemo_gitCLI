<?php

namespace App\Http\Requests\Blocks;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigUpdateRequest extends Data
{
    public function __construct(
        #[Required, ArrayType]
        public array $data
    ) {}
}
