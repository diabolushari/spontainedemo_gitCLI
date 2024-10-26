<?php

namespace App\Http\Controllers\DataDetail;

use App\Exports\DataTableExport;
use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Routing\Controllers\HasMiddleware;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportDataTableController extends Controller implements HasMiddleware
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

    public function __invoke(DataDetail $dataDetail): BinaryFileResponse
    {
        return Excel::download(new DataTableExport($dataDetail, new QueryDataTable), 'data-table.xlsx');
    }
}
