<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewChartUpdateRequest;
use App\Models\Blocks\Block;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigOverviewTableUpdateController extends Controller
{

    public function __invoke(Request $request, $id): RedirectResponse
    {
        $block = Block::findOrFail($id);
        $block->data = [
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'trend' => $request->input('trend'),
            'ranking' => $request->input('ranking'),
            'default_date' => $request->input('default_date'),
            'data_table_id' => $request->input('data_table_id'),
            'subset_group_id' => $request->input('subset_group_id'),
            'overview' => $request->input('overview'),
        ];

        $block->save();
        dd($block, $request);
        return redirect()->back();
    }
}
