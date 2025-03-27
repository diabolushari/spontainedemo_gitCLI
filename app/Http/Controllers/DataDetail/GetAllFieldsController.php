<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableRelation;
use Illuminate\Http\JsonResponse;

final class GetAllFieldsController extends Controller
{
    public function __invoke(DataDetail $dataDetail): JsonResponse
    {

        $relations = DataTableRelation::where('related_table_id', $dataDetail->id)
            ->pluck('data_detail_id');

        $dataDetails = DataDetail::whereIn('id', $relations)->get();

        $dataDetail->load(
            'dateFields',
            'dimensionFields',
            'measureFields',
            'textFields',
        );

        $fields = [
            'dates' => $dataDetail->dateFields,
            'dimensions' => $dataDetail->dimensionFields,
            'measures' => $dataDetail->measureFields,
            'texts' => $dataDetail->textFields,
            'relations' => $dataDetails,
        ];

        return response()->json($fields);
    }
}
