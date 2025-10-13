<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\DataLoader\LoaderAPI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class LoaderAPIListController extends Controller implements HasMiddleware
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
        $loaderAPIs = LoaderAPI::orderBy('created_at', 'desc')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('name', 'like', '%'.$request->input('search').'%')
            )
            ->paginate($request->input('per_page', 5));

        return response()->json($loaderAPIs);
    }
}
