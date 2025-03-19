<?php

namespace App\Services\DataLoader\Connection;

use App\Services\DataLoader\Contracts\DataFetcherInterface;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class RunLoaderQuery implements DataFetcherInterface
{
    /**
     * @return array[]
     *
     * @throws Exception
     */
    public function fetchData(DataLoaderSource $dataSource): array
    {
        if ($dataSource->type !== 'SQL' || $dataSource->queryInfo === null) {
            throw new Exception('Invalid data source type for SQL query');
        }

        $connectionName = 'connection'.$dataSource->queryInfo->loaderConnection->id;

        Config::set("database.connections.$connectionName", [
            'driver' => $dataSource->queryInfo->loaderConnection->driver,
            'host' => $dataSource->queryInfo->loaderConnection->host,
            'port' => $dataSource->queryInfo->loaderConnection->port,
            'username' => $dataSource->queryInfo->loaderConnection->username,
            'database' => $dataSource->queryInfo->loaderConnection->database,
            'password' => $dataSource->queryInfo->loaderConnection->password,
        ]);

        DB::purge($connectionName);

        $result = DB::connection($connectionName)->select($dataSource->queryInfo->query);

        //convert the result to array
        $data = [];

        foreach ($result as $row) {
            $data[] = (array) $row;
        }

        return $data;
    }
}
