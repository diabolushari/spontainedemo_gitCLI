<?php

namespace App\Services\DataLoader\FetchData;

use App\Services\DataLoader\DataSource\DataLoaderSource;
use Exception;

interface DataFetcher
{
    /**
     * @return array[]
     *
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array;
}
