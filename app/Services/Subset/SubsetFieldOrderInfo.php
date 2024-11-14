<?php

namespace App\Services\Subset;

use Spatie\LaravelData\Data;

class SubsetFieldOrderInfo extends Data
{
    public function __construct(
        public string $column,
        public string $sortOrder
    ) {}
}
