<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\HierarchyByLevelSearchRequest;
use App\Models\Meta\MetaData;
use App\Models\Meta\MetaHierarchyItem;
use App\Models\Meta\MetaHierarchyLevelInfo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaHierarchySearchController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(HierarchyByLevelSearchRequest $request): JsonResponse
    {
        if ($request->search == null) {
            return response()
                ->json();
        }

        /** @var MetaData|null $metaData */
        $metaData = MetaData::find($request->currentMetaDataId);

        /** @var Collection<int, MetaHierarchyLevelInfo> $hierarchyLevels */
        $hierarchyLevels = MetaHierarchyLevelInfo::where('meta_hierarchy_id', $request->hierarchy)
            ->get();

        $level = null;
        if ($metaData != null) {
            //find level with same structure id a selected meta data
            $currentLevel = $hierarchyLevels->first(fn (MetaHierarchyLevelInfo $level) => $level->meta_structure_id == $metaData->meta_structure_id);
            //prev level
            if ($currentLevel != null) {
                $level = $hierarchyLevels->first(
                    fn (MetaHierarchyLevelInfo $level) => $level->level == $currentLevel->level - 1
                );
            }
        }

        $hierarchy = MetaHierarchyItem::joinMetaData()
            ->when(
                $request->hierarchy != null,
                fn (Builder $query) => $query->where('meta_hierarchy_items.meta_hierarchy_id', $request->hierarchy)
            )
            ->where('meta_data.name', 'like', "%$request->search%")
            ->when(
                $level != null,
                fn (Builder $query) => $query->where('meta_data.meta_structure_id', $level->meta_structure_id)
            )
            ->select(['meta_hierarchy_items.id', 'meta_data.name as name', 'meta_data.id as meta_data_id', 'meta_structures.structure_name'])
            ->limit(10)
            ->get();

        return response()
            ->json($hierarchy);
    }
}
