<?php

namespace App\Services\DataLoader\DataSource;

use App\Models\DataLoader\DataLoaderQuery;
use App\Models\DataLoader\LoaderAPI;
use Spatie\LaravelData\Data;

/**
 * Type can be eiter SQL|REST_API
 */
class DataLoaderSource extends Data
{
    public function __construct(
        public string $type,
        public ?DataLoaderQuery $queryInfo,
        public ?LoaderAPI $apiInfo,
    ) {}

    public static function fromLoaderSourceModel(DataLoaderQuery|LoaderAPI $sourceModel): self
    {
        if ($sourceModel instanceof DataLoaderQuery) {
            return new self('SQL', $sourceModel, null);
        }

        return new self('REST_API', null, $sourceModel);
    }
}
