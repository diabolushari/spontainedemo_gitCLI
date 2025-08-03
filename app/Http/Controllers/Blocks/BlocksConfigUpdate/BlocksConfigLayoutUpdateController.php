<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigLayoutUpdateRequest;
use App\Models\Blocks\Block;
use Illuminate\Http\RedirectResponse;

class BlocksConfigLayoutUpdateController extends Controller
{
    public function __invoke(BlocksConfigLayoutUpdateRequest $request, $id): RedirectResponse
    {
        $block = Block::findOrFail($id);
        $blockData = $block->data ?? [];
        $blockData['overview_selected'] = $request->overview_selected;
        $blockData['trend_selected'] = $request->trend_selected;
        $blockData['ranking_selected'] = $request->ranking_selected;
        $block->data = $blockData;

        $block->save();

        return redirect()->back();
    }
}
