<?php

namespace App\Http\Controllers\Blocks\DataExplorerCard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\DataExplorer\DataExplorerFormRequest;
use App\Models\Blocks\PageBlock;
use Illuminate\Http\Request;

class DataExplorerCardUpdateController extends Controller
{
    public function __invoke(DataExplorerFormRequest $request, $id)
    {
        $block = PageBlock::findOrFail($id);
        $data = $block->data ?? [];
        $data['title'] = $request->title;
        $data['description'] = $request->description;
        $data['subset_group_id'] = $request->subsetGroupId;
        $data['default_subset_id'] = $request->defaultSubsetId;
        $data['data_table_id'] = $request->dataTableId;
        $data['default_view'] = $request->defaultView;
        $block->update(['data' => $data]);
        $block->save();

        return redirect()->back()->with('message', 'Block updated successfully');
    }
}
