<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableRequest;
use App\Models\Blocks\PageBlock;
use Illuminate\Http\Request;


class BlocksConfigOverviewTableUpdateController extends Controller
{

    public function __invoke(BlocksConfigOverviewTableRequest $request, $id)
    {
        $block = PageBlock::findOrFail($id);
        $blockData = $block->data ?? [];
        $existingTables = $blockData['overview']['overview_table'] ?? [];
        $existingTables[] = $request->overview_table;
        $blockData['overview']['overview_table'] = $existingTables;
        $block->data = $blockData;

        $block->save();

        return redirect()->back();
    }
}
