<?php

namespace App\Services\DataLoader\Connection;

use App\Libs\ErrorResponse;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\DataLoaderConnection;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class LoaderConnectionStatusCheck
{
    public function __construct()
    {
        //
    }

    /**
     * connection name is connection's database record id appended to connection
     *
     * Example:
     *  connection1
     *  connection2
     *  connection3
     */
    public function checkStatus(
        DataLoaderConnection $connection
    ): ErrorResponse {

        $connectionName = 'connection'.$connection->id;

        try {
            Config::set("database.connections.$connectionName", [
                'driver' => $connection->driver,
                'host' => $connection->host,
                'port' => $connection->port,
                'username' => $connection->username,
                'database' => $connection->database,
                'password' => $connection->password,
            ]);

            DB::purge($connectionName);

            DB::connection($connectionName)->getDatabaseName();
            DB::connection($connectionName)->getPdo();
        } catch (Exception $e) {
            return new ErrorResponse(true, ExceptionMessage::getMessage($e));
        }

        return new ErrorResponse(false, 'Connection successful');

    }
}
