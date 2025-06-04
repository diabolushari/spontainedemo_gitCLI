<?php

namespace App\Http\Requests\PageBuilder;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Illuminate\Validation\Rule;

#[MapName(SnakeCaseMapper::class)]
class PageBuilderFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $title,

        #[Max(1000)]
        public ?string $description,

        #[Date]
        public ?string $publishedAt,

        public string $url,

    ) {}

    public static function rules(): array
    {

        $pageId = request()->route('page_builder');

        return [
            'title' => ['max:255'],
            'description' => ['max:1000'],
            'published_at' => ['date'],
            'url' => [
                'required',
                'string',
                Rule::unique('pages', 'url')->ignore($pageId)
            ],
        ];
    }
}
