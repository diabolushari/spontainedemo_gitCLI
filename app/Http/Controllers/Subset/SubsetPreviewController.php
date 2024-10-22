<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use App\Services\Subset\SubsetQueryBuilder;
use Inertia\Inertia;
use Inertia\Response;

class SubsetPreviewController extends Controller
{
    public function __invoke(SubsetDetail $subsetDetail, SubsetQueryBuilder $builder): Response
    {

        $dataDetail = DataDetail::find($subsetDetail->data_detail_id);

        $dates = SubsetDetailDate::where('subset_detail_id', $subsetDetail->id)->get()
            ->pluck('field_id')
            ->toArray();

        $dimensions = SubsetDetailDimension::where('subset_detail_id', $subsetDetail->id)->get()
            ->pluck('field_id')
            ->toArray();

        $measures = SubsetDetailMeasure::where('subset_detail_id', $subsetDetail->id)->get()
            ->pluck('field_id')
            ->toArray();

        $dataDetail->load([
            'dateFields' => fn ($query) => $query->whereIn('id', $dates),
            'dimensionFields' => fn ($query) => $query->whereIn('id', $dimensions),
            'measureFields' => fn ($query) => $query->whereIn('id', $measures),
        ]);

        return Inertia::render('Subset/SubsetPreview', [
            'subset' => $subsetDetail,
            'dataDetail' => $dataDetail,
            'data' => $builder->query($subsetDetail)
                ->paginate(50)
                ->withQueryString(),
        ]);
    }
}
