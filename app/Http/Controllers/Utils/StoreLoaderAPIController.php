<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderAPIFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\LoaderAPI;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

final class StoreLoaderAPIController extends Controller implements HasMiddleware
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

    public function __invoke(DataLoaderAPIFormRequest $request): JsonResponse
    {
        try {
            /** @var LoaderAPI $record */
            $record = LoaderAPI::create([
                'name' => $request->name,
                'description' => $request->description,
                'method' => $request->method,
                'url' => $request->url,
                'headers' => $request->headers,
                'body' => $request->body,
                'response_structure' => $request->responseStructure,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'API created successfully.',
                'data' => $record,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => ExceptionMessage::getMessage($e),
            ], 500);
        }
    }
}