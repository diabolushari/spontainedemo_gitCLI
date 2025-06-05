<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class BlocksUpdateDimensionController extends Controller implements HasMiddleware
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
        $dataDetailId = $request->data_detail_id;

        if ($dataDetailId) {
            $dataDetail = DataDetail::findOrFail($dataDetailId);
            $block->data = $dataDetail->toArray();
            $block->save();
        }

        if ($request->dimensions) {
            $block->update([
                'dimensions' => $request->dimensions,
            ]);
        }

        return redirect()->back()->with('message', 'Block updated successfully!');
    }
}
