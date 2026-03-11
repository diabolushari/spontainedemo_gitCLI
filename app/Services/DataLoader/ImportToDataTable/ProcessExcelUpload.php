<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use App\Libs\OperationResult;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\DataTableImport;

readonly class ProcessExcelUpload
{
    public function __construct(
        private ImportToDataTable $importToDataTable
    ) {
    }

    public function process(DataDetail $dataDetail, UploadedFile $file): OperationResult
    {
        try {
            $excelSheet = Excel::toArray(new DataTableImport, $file);

            if (empty($excelSheet) || empty($excelSheet[0])) {
                return OperationResult::from([
                    'error' => true,
                    'message' => 'No data to import in Excel file',
                ]);
            }

            Log::info('Excel sheet data for direct import:', $excelSheet);

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

            $result = $this->importToDataTable->importToDataTable($dataDetail, $dataTable);

            if ($result['is_successful']) {
                DB::commit();
                return OperationResult::from([
                    'error' => false,
                    'message' => 'Data imported successfully',
                ]);
            }

            DB::rollBack();

            return OperationResult::from([
                'error' => true,
                'message' => $result['error_message'],
            ]);

        } catch (Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }

            Log::error('ProcessExcelUpload exception', ['message' => $e->getMessage()]);
            return OperationResult::from([
                'error' => true,
                'message' => 'Error parsing Excel file: ' . $e->getMessage(),
            ]);
        }
    }
}
