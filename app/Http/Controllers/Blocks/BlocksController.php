<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksFormRequest;
use App\Http\Requests\Blocks\BlocksUpdateFormRequest;
use App\Models\Blocks\Block;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class BlocksController extends Controller
{
    public function store(BlocksFormRequest $request): RedirectResponse
    {
        try {
            $maxPosition = Block::where('page_id', $request->pageId)
                ->max('position');
            $newPosition = $maxPosition ? $maxPosition + 1 : 1;
            $block = Block::create([
                'name' => $request->name,
                'position' => $newPosition,
                'dimensions' => $request->dimensions,
                'page_id' => $request->pageId,
            ]);
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }

        return redirect()
            ->route('page-builder.show', $block->page_id)
            ->with(['message' => 'Block added successfully']);
    }

    public function update(BlocksUpdateFormRequest $request, int $id): RedirectResponse
    {

        $block = Block::findOrFail($id);
        $adjacentBlock = null;
        if ($request->action) {

            if ($request->action === 'up') {
                $adjacentBlock = Block::where('position', '<', $block->position)
                    ->where('page_id', $block->page_id)
                    ->orderBy('position', 'desc')
                    ->first();
            } elseif ($request->action === 'down') {
                $adjacentBlock = Block::where('position', '>', $block->position)
                    ->where('page_id', $block->page_id)
                    ->orderBy('position', 'asc')
                    ->first();
            }

            if ($adjacentBlock) {
                DB::beginTransaction();
                try {
                    $tempPosition = $block->position;
                    $block->position = $adjacentBlock->position;
                    $adjacentBlock->position = $tempPosition;

                    $block->save();
                    $adjacentBlock->save();

                    DB::commit();

                    return redirect()->back()->with('message', "Block moved {$request->action} successfully!");
                } catch (Exception $e) {
                    DB::rollBack();

                    return redirect()->back()->with('error', 'An error occurred while moving block: '.$e->getMessage());
                }
            }
        }

        return redirect()->back()->with('message', 'Block updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {

        try {
            $block = Block::findOrFail($id);
            $block->delete();
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }

        return redirect()->back()->with(['message' => 'Block deleted successfully']);
    }
}
