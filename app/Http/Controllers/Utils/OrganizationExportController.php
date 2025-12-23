<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Meta\MetaHierarchy;

class OrganizationExportController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $organizations = Organization::query()
            ->with([
                'metaHierarchyItem.metaHierarchy',
                'metaHierarchyItem.primaryField',
                'metaHierarchyItem.secondaryField'
            ])
            ->get();

        $data = $organizations->map(function ($org) {
            $hierarchyItem = $org->metaHierarchyItem;
            $hierarchyDef = $hierarchyItem?->metaHierarchy;

            // Construct the item string (e.g. "Sales - North")
            $primaryVal = $hierarchyItem?->primaryField?->name ?? '';
            $secondaryVal = $hierarchyItem?->secondaryField?->name ?? '';
            $itemString = $secondaryVal ? "{$primaryVal} - {$secondaryVal}" : $primaryVal;

            return [
                'id' => $org->id,
                'name' => $org->name,

                // Updated hierarchy object with field definitions
                'hierarchy' => $hierarchyDef ? [
                    'id' => $hierarchyDef->id,
                    'name' => $hierarchyDef->name,
                    'description' => $hierarchyDef->description,
                    'primary_field_name' => $hierarchyDef->primary_field_name,
                    'secondary_field_name' => $hierarchyDef->secondary_field_name,
                ] : null,

                'hierarchy_item' => $itemString,
                'hierarchy_connection' => $org->hierarchy_connection ?? '',

                'industry_context' => $org->industry_context ?? '',

                'full_address' => implode(', ', array_filter([
                    $org->address,
                    $org->state,
                    $org->country
                ])),
                'country' => $org->country,

                'objectives' => $org->objectives,

                'created_at' => $org->created_at->toIso8601String(),
                'updated_at' => $org->updated_at->toIso8601String(),
            ];
        });

        return response()->json($data);
    }
}
