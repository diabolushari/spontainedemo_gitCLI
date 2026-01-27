<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class MetaHierarchyItemSearchController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $hierarchyId = $request->query('hierarchy_id');

        if (empty($search)) {
            return response()->json([]);
        }

        $query = MetaHierarchyItem::query()
            ->with(['primaryField.metaStructure', 'secondaryField.metaStructure'])
            ->where(function ($q) use ($search) {
                // Search in primary field name
                $q->whereHas('primaryField', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%{$search}%");
                })
                    // Or search in secondary field name
                    ->orWhereHas('secondaryField', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%{$search}%");
                });
            });

        if ($hierarchyId) {
            $query->where('meta_hierarchy_id', $hierarchyId);
        }

        $items = $query->limit(15)->get();

        // Transform for ComboBox compatibility
        $result = $items->map(function ($item) {
            $primaryName = $item->primaryField?->name ?? '';
            $secondaryName = $item->secondaryField?->name ?? '';
            $displayName = $secondaryName ? "{$primaryName} - {$secondaryName}" : $primaryName;

            return [
                'id' => $item->id,
                'name' => $displayName ?: 'Unknown',
                'structure_name' => $item->primaryField?->metaStructure?->structure_name ?? '',
            ];
        });

        return response()->json($result);
    }
}
