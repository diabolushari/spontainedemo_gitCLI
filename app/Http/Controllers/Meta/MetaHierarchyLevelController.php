<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyLevelInfo;
use Illuminate\Http\JsonResponse;

class MetaHierarchyLevelController extends Controller
{

    public function show(MetaHierarchyLevelInfo $metaHierarchyLevel): JsonResponse
    {
        return response()->json($metaHierarchyLevel);
    }

    public function getByHierarchy(MetaHierarchy $metaHierarchy): JsonResponse
    {
        $levels = $metaHierarchy->levels->map(function ($level) {
            $level->value = \Illuminate\Support\Str::snake($level->name);
            return $level;
        });

        return response()->json($levels);
    }
}
