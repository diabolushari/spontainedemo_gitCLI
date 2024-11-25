<?php

namespace App\Http\Controllers\DataExplorer;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Models\SubsetGroup\SubsetGroup;
use App\Models\SubsetGroup\SubsetGroupItem;
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

    public function __invoke(string $subsetGroup, Request $request): Response
    {

        return $subsetGroup;

        $subsetGroup = SubsetGroup::where('name', $subsetGroup)->firstOrFail();

        $subsetDetails = SubsetGroupItem::where('subset_group_id', $subsetGroup->id)
            ->pluck('subset_detail_id')
            ->toArray();

        $subsets = SubsetDetail::whereIn('id', $subsetDetails)
            ->with('dimensions.info', 'measures.info', 'measures.weightInfo', 'dates.info')
            ->get();

        return Inertia::render('DataExplorer/DataExplorer', [
            'subsetGroup' => $subsetGroup,
            'subsets' => $subsets,
            'oldTab' => $request->input('tab', 'state'),
            'oldSubsetName' => $request->input('subset', null),
        ]);
    }
}
