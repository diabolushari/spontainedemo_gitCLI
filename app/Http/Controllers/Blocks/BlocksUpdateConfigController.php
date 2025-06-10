<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdateRequest;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDimension;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class BlocksUpdateConfigController extends Controller
{


    public function __invoke(BlocksConfigUpdateRequest $request, $id): RedirectResponse
    {
        $data = $request->data;
        $block = Block::findOrFail($id);
        $dataDetail = DataDetail::findOrFail($data['data_table_id']);
        $queryDataTable = new QueryDataTable();
        $builder = $queryDataTable->query($dataDetail);
        try {
            $latest = $builder
                ->select('month_year_record.name as month_year')
                ->orderBy('month_year_record.name', 'desc')
                ->value('month_year');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Date field not exist in the current table,
            Please coose another data table for date field');
        }

        $data['default_date'] = $latest;

        $block->update([
            'data' => $data,
        ]);
        $block->save();

        return redirect()->back()->with('message', 'Block updated successfully');
    }
}
