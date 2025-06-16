<?php

namespace App\Http\Controllers\ChartData;

use App\Models\DataDetail\DataDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\Controller;
use App\Services\DataTable\JoinDataTable;
use App\Services\DataTable\QueryDataTable;

class DataDetailDateController extends Controller
{
    public function __invoke(Request $request, int $dataDetailId)
    {

        $dataDetail = DataDetail::with('dateFields')->findOrFail($dataDetailId);
        $detail = DataDetail::with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->where('id', $dataDetailId)
            ->first();

        $query = $this->joinDataTable->join($detail);


        $latestValue = $query
            ->selectRaw("MAX($expression) as max_value")
            ->first();
        dd($result);

        return Response::json($result);
    }
}
