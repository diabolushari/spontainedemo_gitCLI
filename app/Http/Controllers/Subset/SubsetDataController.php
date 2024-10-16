<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetQueryBuilder;

class SubsetDataController extends Controller
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(SubsetDetail $subsetDetail, SubsetQueryBuilder $queryBuilder)
    {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info');

        return $queryBuilder->query(
            $subsetDetail
        );
    }
}
