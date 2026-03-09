<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetPermission;
use App\Services\Subset\GetSubsetData;
use App\Services\Subset\QueryBuilder\SubsetFilterBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\UserGroup;
use App\Models\UserGroupPermission;

class SubsetPreviewController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetDetail $subsetDetail, GetSubsetData $getSubsetData, SubsetFilterBuilder $filterBuilder): Response
    {
        $subsetDetail->load('dates.info', 'dimensions.info', 'dimensions.hierarchy', 'measures.info', 'measures.weightInfo', 'texts.info');

        $query = $getSubsetData
            ->setFilters(request()->all())
            ->withSubsetDetail($subsetDetail->id)
            ->getQuery();
        $groups = UserGroup::all();
        $permissions = SubsetPermission::where('subset_id', $subsetDetail->id)->with('groups')->get();
        return Inertia::render('Subset/SubsetPreview', [
            'subset' => $subsetDetail,
            /** @var \Illuminate\Pagination\LengthAwarePaginator $data */
            'data' => $query?->paginate(50)
                ->withQueryString(),
            'filters' => request()->all(),
            'groups' => $groups,
            'permissions' => $permissions,
        ]);
    }
}
