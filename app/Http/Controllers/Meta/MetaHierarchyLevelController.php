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
        $levels = $metaHierarchy->levels()
            ->with(['primaryStructure', 'secondaryStructure'])
            ->get()
            ->map(function ($level) {
                $level->value = \Illuminate\Support\Str::snake($level->name);
                $level->makeHidden(['primary_field_structure_id', 'secondary_field_structure_id']);
                return $level;
            });

        return response()->json($levels);
    }
}
