<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\CreateLoaderQueryWithConnectionData;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\DataLoaderConnection;
use App\Models\DataLoader\DataLoaderQuery;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Throwable;

final class StoreLoaderQueryWithConnectionController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    /**
     * @throws Throwable
     */
    public function __invoke(CreateLoaderQueryWithConnectionData $data): JsonResponse
    {
        DB::beginTransaction();
        try {
            $connectionId = $data->connectionId;

            // Create new connection if needed
            if (! $data->useExistingConnection) {
                /** @var DataLoaderConnection $connection */
                $connection = DataLoaderConnection::create([
                    'name' => $data->connectionName,
                    'description' => $data->connectionDescription,
                    'driver' => $data->driver,
                    'host' => $data->host,
                    'port' => $data->port,
                    'username' => $data->username,
                    'password' => $data->password,
                    'database' => $data->database,
                ]);

                $connectionId = $connection->id;
            }

            // Create query
            /** @var DataLoaderQuery $query */
            $query = DataLoaderQuery::create([
                'name' => $data->name,
                'description' => $data->description,
                'query' => $data->query,
                'connection_id' => $connectionId,
            ]);

            $query->load('loaderConnection');
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => ExceptionMessage::getMessage($e),
            ]);
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Query created successfully.',
            'data' => $query,
        ]);
    }
}
