<?php

namespace App\Http\Controllers\Blocks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksFormRequest;
use App\Http\Requests\Blocks\BlocksUpdateFormRequest;
use App\Models\Blocks\Block;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class BlocksController extends Controller
{
    public function index(): Response {}

    public function create(): Response {}

    public function store(BlocksFormRequest $request): RedirectResponse
    {

        try {
            $maxPosition = Block::where('page_id', $request->page_id)->max('position');
            $newPosition = $maxPosition ? $maxPosition + 1 : 1;
            $block = Block::create([
                'name' => $request->name,
                'position' => $newPosition,
                'dimensions' => $request->dimensions,
                'page_id' => $request->page_id,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }

        return redirect()->route('page-builder.show', $block->page_id)->with(['message' => 'Block added successfully']);
    }

    public function show(Request $request, int $id): Response {}

    public function edit(Request $request, int $id): Response {}

    public function update(BlocksUpdateFormRequest $request, int $id): RedirectResponse
    {

        $block = Block::findOrFail($id);
        $adjacentBlock = null;

        if ($request->action) {

            if ($request->action === 'up') {
                $adjacentBlock = Block::where('position', '<', $block->position)
                    ->where('page_id', $block->page_id) // Optional: restrict by page
                    ->orderBy('position', 'desc')
                    ->first();
            } elseif ($request->action === 'down') {
                $adjacentBlock = Block::where('position', '>', $block->position)
                    ->where('page_id', $block->page_id)
                    ->orderBy('position', 'asc')
                    ->first();
            }

            if ($adjacentBlock) {
                $tempPosition = $block->position;
                $block->position = $adjacentBlock->position;
                $adjacentBlock->position = $tempPosition;

                $block->save();
                $adjacentBlock->save();

                return redirect()->back()->with('message', "Block moved {$request->action} successfully!");
            } else {
                return redirect()->back()->with('error', "Cannot move {$request->action}. No adjacent block found.");
            }
        }
        if ($request->dimensions) {
            $block->update([
                'dimensions' => $request->dimensions,
            ]);
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
