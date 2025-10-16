<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Libs\OperationResult;
use App\Services\DataLoader\FetchData\FetchJSONAPI;
use App\Services\DataLoader\JsonStructure\CalculateJsonStructure;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TestDataLoaderAPIController extends Controller
{
    public function __construct(
        private readonly FetchJSONAPI $fetchJSONAPI,
    ) {}

    /**
     * Test API connection with provided configuration before creating the LoaderAPI record
     */
    public function __invoke(Request $request, CalculateJsonStructure $calculateJsonStructure): JsonResponse
    {
        $error = new OperationResult(false, '');
        $data = [];

        try {
            // Validate required fields
            $validated = $request->validate([
                'url' => 'required|string',
                'method' => 'required|string|in:GET,POST',
                'headers' => 'nullable|array',
                'headers.*.key' => 'required|string',
                'headers.*.value' => 'nullable|string',
                'body' => 'nullable|array',
                'body.*.key' => 'required|string',
                'body.*.value' => 'nullable|string',
            ]);

            // Convert headers array to associative array
            $headers = [];
            if (isset($validated['headers'])) {
                foreach ($validated['headers'] as $header) {
                    if (! empty($header['key'])) {
                        $headers[$header['key']] = $header['value'] ?? '';
                    }
                }
            }

            // Convert body array to associative array
            $body = [];
            if (isset($validated['body'])) {
                foreach ($validated['body'] as $param) {
                    if (! empty($param['key'])) {
                        $body[$param['key']] = $param['value'] ?? '';
                    }
                }
            }

            // Set up and execute the API request
            $this->fetchJSONAPI
                ->setUrl($validated['url'])
                ->setMethod($validated['method'])
                ->setHeaders($headers)
                ->setBody($body);

            $data = $this->fetchJSONAPI->getData();
            $noOfRecords = is_array($data) ? count($data) : 0;
            $error->message = "API tested successfully, $noOfRecords records found.";
        } catch (GuzzleException|Exception $e) {
            $error->error = true;
            $error->message = ExceptionMessage::getMessage($e);
        }

        return response()
            ->json([
                'error' => $error->error,
                'errorMessage' => $error->message,
                'result' => is_array($data) ? $calculateJsonStructure->calculate($data) : null,
            ]);
    }
}
