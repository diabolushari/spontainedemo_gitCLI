<?php

namespace App\Http\Requests\Organization;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Image;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class OrganizationFormRequest extends Data
{
    public function __construct(
        #[Required,  Max(255)]
        public readonly string $name,

        #[Required]
        public readonly string $address,

        #[Required, Max(255)]
        public readonly string $state,

        #[Required, Max(255)]
        public readonly string $country,

        #[Required]
        public readonly string $industryContext,

        #[Nullable, Exists('meta_hierarchy_items', 'id')]
        public readonly ?int $metaHierarchyItemId,

        // #[Nullable]
        // public readonly ?array $objectives,

        #[Nullable]
        public readonly ?string $hierarchyConnection,

        #[Nullable, Image, Mimes('jpg,jpeg,png,webp'), Max(10240)]
        public readonly ?UploadedFile $logo,

        #[Nullable]
        public readonly ?string $primaryColour,

        #[Nullable]
        public readonly ?string $secondaryColour,

        #[Nullable]
        public readonly ?string $tertiaryColour,


    ) {}
}
