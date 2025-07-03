<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateRequest;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigRankingUpdateRequest;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigRankingUpdateController extends Controller
{

    public function __invoke(BlocksConfigRankingUpdateRequest $request, $id): RedirectResponse
    {

        $block = Block::findOrFail($id);
        $blockData = $block->data ?? [];
        $blockData['ranking'] = $request->ranking;
        $block->data = $blockData;
        $block->save();



        return redirect()->back();
    }
}
