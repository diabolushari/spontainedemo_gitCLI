<?php

namespace App\Http\Controllers\DataLoader;

use App\Http\Controllers\Controller;
use App\Models\DataLoader\DataLoaderQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class QueryListController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request): JsonResponse
    {

        $queries = DataLoaderQuery::select('id', 'name')
            ->where('connection_id', $request->input('connection_id'))
            ->orderBy('name')
            ->get();

        return response()->json($queries);

    }
}
