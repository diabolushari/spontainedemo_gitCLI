<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetQueryBuilder;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Response;

class SubsetCreateController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetDetail $subsetDetail, SubsetQueryBuilder $queryBuilder, DataDetail $dataDetail): Response
    {
        return inertia('Subset/SubsetCreate', [
            'dataDetail' => $dataDetail,
            'dateFields' => DataTableDate::where('data_detail_id', $dataDetail->id)->get(),
            'dimensionFields' => DataTableDimension::where('data_detail_id', $dataDetail->id)->get(),
            'measureFields' => DataTableMeasure::where('data_detail_id', $dataDetail->id)->get(),
        ]);
    }
}
