<?php

namespace App\Services\DataLoader\Connection;

use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\DataLoaderConnection;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

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
    ): OperationResult {

        $connectionName = 'connection'.$connection->id;

        /** @var string|null $vpnPassword */
        $vpnPassword = config('app.vpn_password');

        Log::info("VPN Password: $vpnPassword");
        if ($vpnPassword !== null) {
            $result = Process::run("echo $vpnPassword | sudo snx -s 125.17.229.163 -u xocortx");
            Log::info($result->output());
        }

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
            return new OperationResult(true, ExceptionMessage::getMessage($e));
        } finally {
            if ($vpnPassword !== null) {
                Process::run('snx -d');
            }
        }

        return new OperationResult(false, 'Connection successful');

    }
}
