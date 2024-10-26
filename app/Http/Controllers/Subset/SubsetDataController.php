<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetFilterBuilder;
use App\Services\Subset\SubsetQueryBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Collection;

class SubsetDataController extends Controller implements HasMiddleware
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

    /**
     * @return Collection<int, mixed>
     */
    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetQueryBuilder $queryBuilder,
        SubsetFilterBuilder $filterBuilder
    ): Collection {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        $query = $queryBuilder->query($subsetDetail);

        $filterBuilder->filter(
            $query,
            $subsetDetail,
            request()->all()
        );

        return $query->get();

    }
}
