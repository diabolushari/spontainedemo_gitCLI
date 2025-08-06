<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;
use App\Services\Subset\QueryBuilder\SubsetFilterBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

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
        $subsetDetail->load('dates.info', 'dimensions.info', 'dimensions.hierarchy', 'measures.info', 'measures.weightInfo');

        $query = $getSubsetData
            ->setFilters(request()->all())
            ->withSubsetDetail($subsetDetail->id)
            ->getQuery();

        return Inertia::render('Subset/SubsetPreview', [
            'subset' => $subsetDetail,
            'data' => $query?->paginate(50)
                ->withQueryString(),
            'filters' => request()->all(),
        ]);
    }
}
