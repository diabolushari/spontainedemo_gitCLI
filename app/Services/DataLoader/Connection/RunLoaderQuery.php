<?php

namespace App\Services\DataLoader\Connection;

use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class RunLoaderQuery
{
    /**
     * @return array[]
     *
     * @throws Exception
     */
    public function runQuery(DataLoaderConnection $connection, DataLoaderQuery $query): array
    {
        $connectionName = 'connection'.$connection->id;

        Config::set("database.connections.$connectionName", [
            'driver' => $connection->driver,
            'host' => $connection->host,
            'port' => $connection->port,
            'username' => $connection->username,
            'database' => $connection->database,
            'password' => $connection->password,
        ]);

        DB::purge($connectionName);

        $result = DB::connection($connectionName)->select($query->query);

        //convert the result to array
        $data = [];

        foreach ($result as $row) {
            $data[] = (array) $row;
        }

        return $data;
    }
}
