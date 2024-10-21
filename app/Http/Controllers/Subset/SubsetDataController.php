<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetQueryBuilder;

class SubsetDataController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(SubsetDetail $subsetDetail, SubsetQueryBuilder $queryBuilder, SubsetFilterBuilder $filterBuilder)
    {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info');

        $query = $queryBuilder->query($subsetDetail);

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            request()->all()
        );

        return $query->limit(100)->get();

    }
}
