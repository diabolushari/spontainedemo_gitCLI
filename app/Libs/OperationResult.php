<?php

namespace App\Libs;

use Spatie\LaravelData\Data;

class OperationResult extends Data
{
    public function __construct(
        public bool $error,
        public ?string $message
    ) {}
}
