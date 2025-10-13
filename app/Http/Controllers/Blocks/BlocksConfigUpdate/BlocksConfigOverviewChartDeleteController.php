<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Models\Blocks\PageBlock;
use Illuminate\Http\RedirectResponse;

class BlocksConfigOverviewChartDeleteController extends Controller
{
    public function __invoke($blockId): RedirectResponse
    {
        $block = PageBlock::findOrFail($blockId);
        $blockData = $block->data ?? [];

        // Ensure the target data exists and is an array
        if (!isset($blockData['overview']['overview_chart']) || !is_array($blockData['overview']['overview_chart'])) {
            return redirect()->back()->with('error', 'Overview chart not found.');
        }

        // Filter out the item with matching id (convert both sides to string or int to avoid mismatch)
        $blockData['overview']['overview_chart'] = null;

        $block->data = $blockData;
        $block->save();

        return redirect()->back()->with('success', 'Overview chart deleted successfully.');
    }
}
