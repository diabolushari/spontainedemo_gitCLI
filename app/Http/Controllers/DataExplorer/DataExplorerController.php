<?php

namespace App\Http\Controllers\DataExplorer;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;
use App\Services\DistributionHierarchy\CachedOfficeLIst;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class DataExplorerController extends Controller implements HasMiddleware
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

    public function __invoke(string $subsetGroup, CachedOfficeLIst $cachedOfficeLIst, Request $request): Response
    {
        $subsetGroup = SubsetGroup::where('name', $subsetGroup)->firstOrFail();

        $groups = SubsetGroupItem::where('subset_group_id', $subsetGroup->id)
            ->with([
                'subset' => fn ($query) => $query->with([
                    'heirarchy.levels',
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
        

        return Inertia::render('DataExplorer/DataExplorerPage', [
            'subsetGroup' => $subsetGroup,
            'subsetItems' => $groups,
            'oldTab' => $request->input('tab', 'state'),
            'oldSubsetName' => $request->input('subset', null),
            'oldFilters' => $request->all(),
            'oldRoute' => $request->input('route'),
            'offices' => $offices,
        ]);
    }
}
