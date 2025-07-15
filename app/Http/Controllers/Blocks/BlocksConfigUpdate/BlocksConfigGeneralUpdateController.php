<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateRequest;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;

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
                'data_table_id' => 'Date field not exist in the current table. Please choose another data table for the date field.',
            ]);
        }

        $block = Block::findOrFail($id);
        $existingData = $block->data ?? [];
        $subsetGroupChanged = isset($existingData['subset_group_id']) &&
            $existingData['subset_group_id'] != $request->subsetGroupId;

        $updatedData = $existingData;

        if ($subsetGroupChanged) {
            unset($updatedData['trend']);
            unset($updatedData['ranking']);
        }

        $updatedData['title'] = $request->title;
        $updatedData['description'] = $request->description;
        $updatedData['data_table_id'] = $request->dataTableId;
        $updatedData['subset_group_id'] = $request->subsetGroupId;
        $updatedData['default_view'] = $request->defaultView;
        $updatedData['trend_selected'] = $request->trendSelected;
        $updatedData['ranking_selected'] = $request->rankingSelected;
        $updatedData['explore_button_group'] = $request->exploreButtonGroup;
        $updatedData['overview_selected'] = $request->overviewSelected;

        $overviewArray = [];

        if (is_array($request->overview)) {
            $overviewArray = $request->overview;
        } elseif (!is_null($request->overview) && method_exists($request->overview, 'toArray')) {
            $overviewArray = $request->overview->toArray();
        }

        $cardTypeChanged = isset($existingData['overview']['card_type']) &&
            isset($overviewArray['card_type']) &&
            $existingData['overview']['card_type'] !== $overviewArray['card_type'];

        if ($subsetGroupChanged || $cardTypeChanged) {
            if (isset($updatedData['overview']) && is_array($updatedData['overview'])) {
                unset($updatedData['overview']['overview_chart']);
                unset($updatedData['overview']['overview_table']);
            }
        }

        if (!$subsetGroupChanged) {
            if (!empty($existingData['overview'])) {
                // Do nothing
            } elseif (!empty($overviewArray)) {
                $updatedData['overview'] = $overviewArray;
            }
        }

        $block->data = $updatedData;
        $block->save();

        return redirect()->back();
    }
}
