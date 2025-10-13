<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;



use Spatie\LaravelData\Data;

class BlocksConfigLayoutUpdateRequest extends Data
{
    public function __construct(
        public bool $overview_selected,
        public bool $trend_selected,
        public bool $ranking_selected,
    ) {}

    public static function rules(): array
    {
        return [
            'overview_selected.required' => 'Overview is required',
            'trend_selected.required' => 'Trend is required',
            'ranking_selected.required' => 'Ranking is required',
        ];
    }
}
