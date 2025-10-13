<?php

namespace App\Http\Controllers\DataDetail\Setup;

use App\Http\Controllers\Controller;
use App\Models\ReferenceData\ReferenceData;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class SetupDatatableController extends Controller implements HasMiddleware
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
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('SetupDatatable/SetupDatatablePage', [
            'types' => $referenceData,
        ]);
    }
}
