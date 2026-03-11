<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\DataTable\DataTableText;
use App\Models\Meta\MetaHierarchy;
use App\Models\Subset\SubsetDetail;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetEditController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetDetail $subsetDetail)
    {
        $subsetDetail->load(['dates', 'dimensions', 'measures', 'texts', 'dataDetail']);

        $dataDetail = DataDetail::findOrFail($subsetDetail->data_detail_id);
        // $herirarchy = MetaHierarchy::with('levels')->get();
        // dd($herirarchy);

        return inertia('Subset/SubsetEdit', [
            'subsetDetail' => $subsetDetail,
            'dataDetail' => $dataDetail,
            'dateFields' => DataTableDate::where('data_detail_id', $dataDetail->id)->get(),
            'dimensionFields' => DataTableDimension::where('data_detail_id', $dataDetail->id)->get(),
            'measureFields' => DataTableMeasure::where('data_detail_id', $dataDetail->id)->get(),
            'textFields' => DataTableText::where('data_detail_id', $dataDetail->id)->get(),
            'hierarchies' => MetaHierarchy::select('id', 'name')->get(),
        ]);
    }
}
