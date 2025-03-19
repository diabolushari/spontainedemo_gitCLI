<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\DataLoaderQuery;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\Factory\DataLoaderFactory;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class DataLoaderQueryDataController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(
        DataLoaderQuery $dataLoaderQuery,
        DataLoaderFactory $dataLoaderFactory
    ): JsonResponse {
        $error = new OperationResult(false, '');

        $result = [];

        if ($dataLoaderQuery->loaderConnection == null) {
            $error->message = 'Connection not found';
        } else {
            try {
                $dataSource = DataLoaderSource::fromLoaderSourceModel($dataLoaderQuery);
                $result = $dataLoaderFactory->createFetcher($dataSource->type)->fetchData($dataSource);
                $noOfRecords = count($result);
                $error->message = "Query executed successfully, $noOfRecords records found.";
            } catch (Exception $e) {
                $error->error = true;
                $error->message = ExceptionMessage::getMessage($e);
            }
        }

        return response()
            ->json([
                'error' => $error->error,
                'errorMessage' => $error->message,
                'result' => array_slice($result, 0, 10),
            ]);
    }
}
