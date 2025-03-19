<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\LoaderAPI;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\Factory\DataLoaderFactory;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;

class DataLoaderAPIDataController extends Controller
{
    public function __invoke(
        LoaderAPI $loaderAPI,
        DataLoaderFactory $dataLoaderFactory,
    ): JsonResponse {

        $error = new OperationResult(false, '');

        $data = [];

        try {
            $dataSource = DataLoaderSource::fromLoaderSourceModel($loaderAPI);
            $data = $dataLoaderFactory->createFetcher($dataSource->type)->fetchData($dataSource);
            $noOfRecords = count($data);
            $error->message = "Query executed successfully, $noOfRecords records found.";
        } catch (GuzzleException|Exception $e) {
            $error->error = true;
            $error->message = ExceptionMessage::getMessage($e);
        }

        return response()
            ->json([
                'error' => $error->error,
                'errorMessage' => $error->message,
                'result' => array_slice($data, 0, 10),
            ]);
    }
}
