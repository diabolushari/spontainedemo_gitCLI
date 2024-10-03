<?php

namespace App\Services\DataLoader\Connection;

use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Process;

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

        /** @var string|null $vpnPassword */
        $vpnPassword = config('app.vpn_password');

        if ($vpnPassword !== null) {
            Process::run("echo $vpnPassword | snx -s 125.17.229.163 -u xocortx");
        }

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

        if ($vpnPassword !== null) {
            Process::run('snx -d');
        }

        return json_decode(json_encode($result), true);
    }
}
