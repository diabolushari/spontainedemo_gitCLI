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
                'data_table_id' => 'Date field not exist in the current table. Please choose another data table for the date field.',
            ]);
        }

        $block = Block::findOrFail($id);
        // Check for subset group change
        $existingData = $block->data ?? [];
        $subsetGroupChanged = isset($existingData['subset_group_id']) &&
            $existingData['subset_group_id'] != $request->subsetGroupId;

        // Prepare updated data
        $updatedData = $existingData;

        // Remove trend, ranking, and overview if subset group changed
        if ($subsetGroupChanged) {
            unset($updatedData['trend']);
            unset($updatedData['ranking']);
            unset($updatedData['overview']);
        }

        // Always update these fields
        $updatedData['title'] = $request->title;
        $updatedData['description'] = $request->description;
        $updatedData['data_table_id'] = $request->dataTableId;
        $updatedData['subset_group_id'] = $request->subsetGroupId;
        $updatedData['default_view'] = $request->defaultView;
        $updatedData['trend_selected'] = $request->trendSelected;
        $updatedData['ranking_selected'] = $request->rankingSelected;
        $updatedData['overview_selected'] = $request->overviewSelected;

        // Update overview only if subset group hasn't changed
        if (!$subsetGroupChanged) {
            $overviewArray = [];

            if (is_array($request->overview)) {
                $overviewArray = $request->overview;
            } elseif (!is_null($request->overview) && method_exists($request->overview, 'toArray')) {
                $overviewArray = $request->overview->toArray();
            }



            if (!empty($existingData['overview']) && !empty($overviewArray)) {
                if (
                    isset($existingData['overview']['card_type']) &&
                    $existingData['overview']['card_type'] !== ($overviewArray['card_type'] ?? null)
                ) {
                    $updatedData['overview'] = $overviewArray;
                } else {
                    $updatedData['overview']['title'] = $overviewArray['title'] ?? '';
                }
            } else {
                $updatedData['overview'] = $overviewArray;
            }
        }


        // Save updated block data
        $block->data = $updatedData;
        $block->save();

        return redirect()->back();
    }
}
