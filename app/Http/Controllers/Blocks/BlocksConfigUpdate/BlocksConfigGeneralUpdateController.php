<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateRequest;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Request;

class BlocksConfigGeneralUpdateController extends Controller
{

    public function __invoke(BlocksConfigGeneralUpdateRequest $request, $id): RedirectResponse
    {
        $dataDetail = DataDetail::findOrFail($request->dataTableId);
        $queryDataTable = new QueryDataTable();
        $builder = $queryDataTable->query($dataDetail);
        try {
            $latest = $builder
                ->select('month_year_record.name as month_year')
                ->orderBy('month_year_record.name', 'desc')
                ->value('month_year');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'data_table_id' => 'Date field not exist in the current table, '
                    . 'Please coose another data table for date field'
            ]);
        }
        $block = Block::findOrFail($id);
        $block->data = [
            'title' => $request->title,
            'description' => $request->description,
            'data_table_id' => $request->dataTableId,
            'subset_group_id' => $request->subsetGroupId,
            'default_view' => $request->defaultView,
            'trend_selected' => $request->trendSelected,
            'ranking_selected' => $request->rankingSelected,
            'overview_selected' => $request->overviewSelected,
        ];
        $block->save();

        return redirect()->back();
    }
}
