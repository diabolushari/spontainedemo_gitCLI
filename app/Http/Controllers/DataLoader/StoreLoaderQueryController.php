<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataLoader\DataLoaderQueryFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataLoader\DataLoaderQuery;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

final class StoreLoaderQueryController extends Controller implements HasMiddleware
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

    public function __invoke(DataLoaderQueryFormRequest $request): JsonResponse
    {
        try {
            /** @var DataLoaderQuery $record */
            $record = DataLoaderQuery::create([
                ...$request->all(),
            ]);

            $record->load('loaderConnection');

            return response()->json([
                'success' => true,
                'message' => 'Query created successfully.',
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
