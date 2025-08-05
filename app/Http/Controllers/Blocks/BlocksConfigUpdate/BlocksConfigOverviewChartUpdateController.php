<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartUpdateRequest;
use Illuminate\Http\RedirectResponse;
use App\Models\Blocks\Block;
use Illuminate\Http\Request;

class BlocksConfigOverviewChartUpdateController extends Controller
{

    public function __invoke(BlocksConfigOverviewChartUpdateRequest $request, $id): RedirectResponse
    {
        $block = Block::findOrFail($id);

        $data = $block->data;
        if (!isset($data['overview'])) {
            $data['overview'] = [];
        }

        $data['overview']['overview_chart'] = $request->overviewChart;
        $block->data = $data;

        $block->save();

        return redirect()->back()->with('success', 'Overview chart updated successfully');
    }
}
