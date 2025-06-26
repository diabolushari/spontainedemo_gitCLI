<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Data;

class BlockConfigMeasureField extends Data
{
    public function __construct(
        public string $value,
        public string $label,
        public string $unit,
        public bool $show_label,
    ) {}
}
