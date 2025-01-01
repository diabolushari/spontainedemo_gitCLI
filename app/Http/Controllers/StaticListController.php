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
            'ageWise' => [
                ['value' => '0-3'],
                ['value' => '4-6'],
                ['value' => '7-12'],
                ['value' => '13-24'],
                ['value' => '>24'],
            ]
        };

        return response()->json([
            'data' => $records,
        ]);
    }
}
