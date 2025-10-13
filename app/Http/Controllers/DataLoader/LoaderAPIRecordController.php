<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Models\DataLoader\LoaderAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

final class LoaderAPIRecordController extends Controller implements HasMiddleware
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

    public function __invoke(LoaderAPI $loaderAPI): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $loaderAPI,
            'message' => 'LoaderAPI record retrieved successfully.',
        ]);
    }
}
