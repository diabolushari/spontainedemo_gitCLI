<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class BlocksUpdateDimensionController extends Controller
{
    /**
     * @return string[]
     */


    public function __invoke(Request $request, $id): RedirectResponse
    {

        $block = Block::findOrFail($id);

        if ($request->dimensions) {
            $block->update([
                'dimensions' => $request->dimensions,
            ]);
        }
        $block->save();

        return redirect()->back()->with('message', 'Block updated successfully!');
    }
}
