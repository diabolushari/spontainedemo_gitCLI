<?php

namespace App\Http\Controllers\Subset;

use App\Exports\SubsetTableExport;
use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SubsetExportController extends Controller implements HasMiddleware
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

    public function __invoke(SubsetDetail $subsetDetail, Request $request, GetSubsetData $getSubsetData): BinaryFileResponse
    {
        $subsetDetail->load('dates.info', 'measures.info', 'measures.weightInfo', 'dimensions.info');

        $data = $getSubsetData
            ->get(
                $subsetDetail,
                true,
                $request->excludeNonMeasurements == '1' ? true :  false,
                $request->input('level', 'region')
            )?->get()->toArray();
    
        return Excel::download(new SubsetTableExport(
            $subsetDetail,
            $data,
        ), Str::snake($subsetDetail->name) . '.xlsx');
    }
}
