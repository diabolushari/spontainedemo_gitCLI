<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function __invoke(Request $request): JsonResponse
    {
        $records = match ($request->type) {
            'voltage' => [
                ['value' => 'LT'],
                ['value' => 'HT'],
                ['value' => 'EHT'],
            ],
            default => [],
            'voltageExceptEht' => [
               ['value' => 'LT'],
                ['value' => 'HT'],
            ]
        };

        return response()->json([
            'data' => $records,
        ]);
    }
}
