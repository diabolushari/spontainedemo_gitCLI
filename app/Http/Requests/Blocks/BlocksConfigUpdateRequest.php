<?php

namespace App\Http\Requests\Blocks;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Illuminate\Validation\Validator;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigUpdateRequest extends Data
{
    public function __construct(
        #[Required, ArrayType]
        public array $data
    ) {}
}
