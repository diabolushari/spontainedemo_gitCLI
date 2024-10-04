<?php

namespace App\Http\Controllers\DataDetail;

use App\Exports\DataTableExport;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportDataTableController
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
