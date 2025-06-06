<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class BlocksUpdateConfigController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(Request $request, $id): RedirectResponse
    {

        $block = Block::findOrFail($id);
        $inputData = $request->except(['_method']);

        $block->data = $inputData;
        $dataDetailId = $request->data_detail_id;


        $block->save();

        return redirect()->back()->with('message', 'Block updated successfully!');
    }
}
