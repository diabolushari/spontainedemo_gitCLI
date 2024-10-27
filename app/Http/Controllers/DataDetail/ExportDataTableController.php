<?php

namespace App\Http\Controllers\DataDetail;

use App\Exports\DataTableExport;
use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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

    public function __invoke(DataDetail $dataDetail): BinaryFileResponse|RedirectResponse
    {
        if (! Schema::hasTable($dataDetail->table_name)) {
            return redirect()
                ->route('data-detail.show', $dataDetail->id)
                ->with(['error' => 'Table '.$dataDetail->table_name.' is missing in database.']);
        }

        $noOfRows = DB::table($dataDetail->table_name)->count();

        if ($noOfRows > 50000) {
            return redirect()
                ->route('data-detail.show', $dataDetail->id)
                ->with(['error' => 'Table '.$dataDetail->table_name.' has more than 50,000 rows.']);
        }

        return Excel::download(new DataTableExport($dataDetail, new QueryDataTable), 'data-table.xlsx');
    }
}
