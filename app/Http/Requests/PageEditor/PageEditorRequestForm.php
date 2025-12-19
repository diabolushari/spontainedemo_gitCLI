<?php

namespace App\Http\Requests\PageEditor;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class PageEditorRequestForm extends Data
{
    public function __construct(
        public readonly string $title,
        public readonly string $description,
        public readonly string $link,
        public readonly array $page,
        public readonly bool $published,
        public readonly int $anchor_widget,
        public readonly ?array $config,
    ) {
    }
}
