<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataLoader\ImportToDataTable\ProcessExcelUpload;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class DataTableExcelUploadController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(DataDetail $dataDetail, Request $request, ProcessExcelUpload $processExcelUpload): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $result = $processExcelUpload->process($dataDetail, $request->file('file'));

        if (!$result->error) {
            return back()
                ->with([
                    'message' => $result->message,
                ]);
        }

        return redirect()
            ->back()
            ->with([
                'error' => $result->message,
            ]);
    }
}
