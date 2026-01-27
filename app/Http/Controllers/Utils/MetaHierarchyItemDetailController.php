<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetaHierarchyItemDetailController extends Controller
{
    /**
     * Retrieve the primary column name and value for a specific hierarchy item.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function __invoke(string $id): JsonResponse
    {
        $item = MetaHierarchyItem::with(['metaHierarchy', 'primaryField'])
            ->findOrFail($id);

        $data = [
            'id' => $item->id,
            'primary_column' => $item->metaHierarchy->primary_column,
            'primary_value' => $item->primaryField?->name,

            'primary_field_label' => $item->metaHierarchy->primary_field_name,
        ];

        return response()->json($data);
    }
}
