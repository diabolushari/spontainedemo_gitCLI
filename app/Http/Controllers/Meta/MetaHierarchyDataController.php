<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaHierarchy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaHierarchyDataController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(Request $request, MetaHierarchy $metaHierarchy): JsonResponse
    {
        return response()->json($metaHierarchy);
    }
}
