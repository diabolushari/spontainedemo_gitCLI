<?php

namespace App\Services\DataLoader\DataSource;

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\DataLoader\DataLoaderQuery;
use App\Models\DataLoader\LoaderAPI;
use InvalidArgumentException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * Type can be either SQL|REST_API
 */
class DataLoaderSource extends Data
{
    public function __construct(
        public string $type,
        public Optional|null|DataLoaderQuery $queryInfo,
        public Optional|null|LoaderAPI $apiInfo,
        /** @var Optional|null|FieldMappingData[] $fieldMapping */
        public Optional|null|array $fieldMapping,
    ) {}

    public static function fromLoaderSourceModel(DataLoaderQuery|LoaderAPI $sourceModel): self
    {
        if ($sourceModel instanceof DataLoaderQuery) {
            return DataLoaderSource::from([
                'type' => 'SQL',
                'queryInfo' => $sourceModel,
            ]);
        }

        return DataLoaderSource::from([
            'type' => 'REST_API',
            'apiInfo' => $sourceModel,
        ]);
    }

    public static function fromLoaderJob(DataLoaderJob $job): self
    {
        if ($job->loaderQuery !== null) {
            return DataLoaderSource::from([
                'type' => 'SQL',
                'queryInfo' => $job->loaderQuery,
                'fieldMapping' => $job->field_mapping,
            ]);
        }

        if ($job->api !== null) {
            return DataLoaderSource::from([
                'type' => 'REST_API',
                'apiInfo' => $job->api,
                'fieldMapping' => $job->field_mapping,
            ]);
        }

        throw new InvalidArgumentException('DataLoaderJob must have either a query or an API configured');
    }

    public function hasFieldMapping(): bool
    {
        return $this->fieldMapping !== null && ! ($this->fieldMapping instanceof Optional);
    }
}
