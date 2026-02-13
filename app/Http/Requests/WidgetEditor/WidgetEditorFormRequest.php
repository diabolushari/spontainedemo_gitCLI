<?php

namespace App\Http\Requests\WidgetEditor;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class WidgetEditorFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string $title,
        #[Max(512)]
        public readonly string $subtitle,
        #[Max(255)]
        public readonly ?string $description,
        public readonly ?string $link,
        public readonly string $type,
        public readonly ?int $collectionId,
        public readonly array $data,
        public readonly ?string $saveMode,
        public readonly ?int $userId,
    ) {
    }
}
