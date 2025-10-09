<?php

namespace App\Http\Requests\WidgetEditor;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class WidgetEditorFormRequest extends Data
{
    public function __construct(
        public readonly string $title,
        public readonly string $subtitle,
        public readonly string $type,
        public readonly int $collectionId,
        public readonly array $data,
    ) {}
}
