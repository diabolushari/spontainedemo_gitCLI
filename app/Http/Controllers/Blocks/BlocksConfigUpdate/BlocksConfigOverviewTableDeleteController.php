<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Models\Blocks\PageBlock;
use Illuminate\Http\Request;


class BlocksConfigOverviewTableDeleteController extends Controller
{
    public function __invoke($id, $blockId)
    {
        $block = PageBlock::findOrFail($blockId);
        $blockData = $block->data ?? [];

        // Ensure the target data exists and is an array
        if (!isset($blockData['overview']['overview_table']) || !is_array($blockData['overview']['overview_table'])) {
            return redirect()->back()->with('error', 'Overview table not found.');
        }

        // Filter out the item with matching id (convert both sides to string or int to avoid mismatch)
        $blockData['overview']['overview_table'] = array_values(array_filter(
            $blockData['overview']['overview_table'],
            function ($table) use ($id) {
                return (string) $table['id'] !== (string) $id;
            }
        ));

        $block->data = $blockData;
        $block->save();

        return redirect()->back()->with('success', 'Grid item deleted successfully.');
    }
}
