<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;
use App\Services\DistributionHierarchy\CachedOfficeLIst;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class DataExplorerDataController extends Controller
{
    public function __invoke(string $subsetGroup, CachedOfficeLIst $cachedOfficeLIst, Request $request): JsonResponse
    {
        $subsetGroup = SubsetGroup::where('id', $subsetGroup)->firstOrFail();

        $groups = SubsetGroupItem::where('subset_group_id', $subsetGroup->id)
            ->with([
                'subset' => fn($query) => $query->with([
                    'dimensions.info',
                    'dimensions.hierarchy',
                    'measures.info',
                    'measures.weightInfo',
                    'dates.info',
                ]),
            ])
            ->orderBy('item_number')
            ->get();

        $offices = $cachedOfficeLIst->getList();

        return response()->json([
            "subsetGroup" => $subsetGroup,
            "subsetItems" => $groups,
            "offices" => $offices,
            "oldFilters" => $request->all(),
            "oldRoute" => $request->input('route'),
            "oldSubsetName" => $request->input('subset', null),
            "oldSubsetId" => $request->input('subset_id', null),
            "oldTab" => $request->input('tab', 'state'),
        ]);
    }
}
