<?php

namespace App\Services\DataLoader\Factory;

use App\Services\DataLoader\Connection\RunLoaderQuery;
use App\Services\DataLoader\Contracts\DataFetcherInterface;
use App\Services\DataLoader\JsonStructure\GetPrimaryFieldData;
use Exception;

class DataLoaderFactory
{
    /**
     * Create a data fetcher based on the source type
     *
     * @throws Exception
     */
    public function createFetcher(string $type): DataFetcherInterface
    {
        return match ($type) {
            'SQL' => app(RunLoaderQuery::class),
            'REST_API' => app(GetPrimaryFieldData::class),
            default => throw new Exception('Unsupported data source type: '.$type),
        };
    }
}
