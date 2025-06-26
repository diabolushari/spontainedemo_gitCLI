<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableRequest;
use App\Models\Blocks\Block;
use Illuminate\Http\RedirectResponse;

class BlocksConfigOverviewTableUpdateController extends Controller
{

    public function __invoke(BlocksConfigOverviewTableRequest $request, $id): RedirectResponse
    {
        $block = Block::findOrFail($id);
        $block->data = [
            'title' => $request->title,
            'description' => $request->description,
            'data_table_id' => $request->dataTableId,
            'subset_group_id' => $request->subsetGroupId,
            'overview' => $request->overview,
            'ranking' => $request->ranking,
            'trend' => $request->trend,

        ];

        $block->save();
        return redirect()->back()->with('message', 'Block configuration updated.');
    }
}
