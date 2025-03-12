<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Models\DataLoader\LoaderAPI;
use App\Services\DataLoader\DataSource\DataLoaderSource;
use App\Services\DataLoader\FetchData\FetchJSONAPI;
use Exception;
use Illuminate\Http\JsonResponse;

class DataLoaderAPIDataController extends Controller
{
    public function __invoke(LoaderAPI $loaderAPI, FetchJSONAPI $fetchJSONAPI): JsonResponse
    {
        $error = new OperationResult(false, '');

        $data = [];

        try {
            $data = $fetchJSONAPI->fetchData(DataLoaderSource::from($loaderAPI));
            $noOfRecords = count($data);
            $error->message = "Query executed successfully, $noOfRecords records found.";
        } catch (Exception $e) {
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
