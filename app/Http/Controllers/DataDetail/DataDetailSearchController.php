<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class DataDetailSearchController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(Request $request): JsonResponse
    {
        $records = DataDetail::when($request->filled('search'), function ($query) use ($request) {
            $query->where('name', 'like', '%'.$request->search.'%');
        })
            ->select('id', 'name')
            ->limit(10)
            ->orderBy('name')
            ->get();

        return response()->json($records);
    }
}
