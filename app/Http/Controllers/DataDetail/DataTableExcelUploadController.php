<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Imports\DataTableImport;
use App\Models\DataDetail\DataDetail;
use App\Services\DataLoader\ImportToDataTable\ImportToDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class DataTableExcelUploadController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(DataDetail $dataDetail, Request $request, ImportToDataTable $importToDataTable): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $excelSheet = Excel::toArray(new DataTableImport, request()->file('file'));

        if (empty($excelSheet) || empty($excelSheet[0])) {
            return back()
                ->with([
                    'error' => 'No data to import',
                ]);
        }
        //convert excel sheet to datatable items
        $dataTable = [];

        $columnTitles = $excelSheet[0][0];

        foreach ($excelSheet[0] as $index => $row) {
            if ($index === 0) {
                continue;
            }
            $record = [];
            foreach ($columnTitles as $columnIndex => $columnTitle) {
                $record[$columnTitle] = $row[$columnIndex] ?? null;
            }
            $dataTable[] = $record;
        }

        // Import data to the data table
        DB::beginTransaction();
        $result = $importToDataTable->importToDataTable($dataDetail, $dataTable);
        if ($result['is_successful']) {
            DB::commit();

            return back()
                ->with([
                    'message' => 'Data imported successfully',
                ]);
        }

        DB::rollBack();

        return redirect()
            ->back()
            ->with([
                'error' => $result['error_message'],
            ]);
    }
}
