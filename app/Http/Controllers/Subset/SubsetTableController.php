<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class SubsetTableController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth',
        ];
    }

    public function __invoke(SubsetDetail $subsetDetail, Request $request): Response
    {
        $subsetDetail->load('dates.info', 'dimensions.info', 'measures.info', 'measures.weightInfo');

        return Inertia::render('Subset/SubsetTablePage', [
            'filters' => $request->all(),
            'subset' => $subsetDetail,
        ]);
    }
}
