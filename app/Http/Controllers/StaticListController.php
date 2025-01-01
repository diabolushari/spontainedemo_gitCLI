<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class StaticListController extends Controller implements HasMiddleware
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

    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['value' => 'LT'],
                ['value' => 'HT'],
                ['value' => 'EHT'],
            ],
        ]);
    }
}
