<?php

namespace App\Services\DataLoader\Contracts;

use App\Services\DataLoader\DataSource\DataLoaderSource;
use Exception;

interface DataFetcherInterface
{
    /**
     * Fetch data from the source and return it as an array
     *
     * @return array[]
     *
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array;
}
