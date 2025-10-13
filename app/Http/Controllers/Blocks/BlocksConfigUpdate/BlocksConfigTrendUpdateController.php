<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigTrendUpdateRequest;
use App\Models\Blocks\PageBlock;
use Illuminate\Http\RedirectResponse;

class BlocksConfigTrendUpdateController extends Controller
{
    public function __invoke(BlocksConfigTrendUpdateRequest $request, $id): RedirectResponse
    {
        $block = PageBlock::findOrFail($id);
        $data = $block->data ?? [];
        $data['trend'] = $request->trend->toArray();
        $block->data = $data;
        $block->save();

        return redirect()->back();
    }
}
