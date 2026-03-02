<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\QueryBuilder\SubsetFilterBuilder;
use App\Services\Subset\SubsetGroupedByColumn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetColumSearchController extends Controller
{
    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetGroupedByColumn $groupedByColumn,
        Request $request,
        SubsetFilterBuilder $filterBuilder
    ): JsonResponse {
        $subsetDetail->load('measures.info', 'dates.info', 'dimensions.info', 'dimensions.hierarchy', 'measures.weightInfo');

        if (!$request->filled('column') || !$request->filled('search')) {
            return response()
                ->json();
        }

        //loop through columns and apply filter
        //to make sure column is valid
        $columnName = null;
        /** @var array<array-key, array{subset_column: string}> $allColumns */
        $allColumns = [
            ...$subsetDetail->dates->toArray(),
            ...$subsetDetail->dimensions->toArray(),
            ...$subsetDetail->measures->toArray(),
        ];

        foreach ($allColumns as $column) {
            if (strtolower($column['subset_column']) == strtolower($request->input('column'))) {
                $columnName = $column['subset_column'];
            }
        }

        if ($columnName == null) {
            return response()
                ->json();
        }

        $queryBuilder = $groupedByColumn->getQuery(
            $subsetDetail,
            $columnName
        );

        $filterBuilder->filter(
            $queryBuilder,
            $subsetDetail,
            [
                $columnName . '_like' => $request->input('search'),
            ]
        );

        $data = $queryBuilder->limit(10)
            ->get();

        return response()
            ->json($data);
    }
}
