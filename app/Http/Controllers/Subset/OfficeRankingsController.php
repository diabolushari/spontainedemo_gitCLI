<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class OfficeRankingsController extends Controller implements HasMiddleware
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

    public function __invoke(string $subsetGroupName, Request $request): Response
    {

        $subsetGroup = SubsetGroup::where('name', $subsetGroupName)
            ->firstOrFail();

        $groups = SubsetGroupItem::where('subset_group_id', $subsetGroup->id)
            ->with([
                'subset' => fn ($query) => $query->with([
                    'dimensions.info',
                    'measures.info',
                    'measures.weightInfo',
                    'dates.info',
                ]),
            ])
            ->orderBy('item_number')
            ->get();

        return Inertia::render('OfficeRanking/OfficeRankingPage', [
            'subsetGroup' => $subsetGroup,
            'subsetItems' => $groups,
            'oldTab' => $request->input('tab', 'region'),
            'oldSubsetName' => $request->input('subset', null),
            'oldRoute' => $request->input('route'),
            'oldFilters' => $request->all(),
            'defaultSort'=>$request->input('sort_by'),
        ]);
    }
}
