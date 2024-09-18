<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyDeleteItemRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaHierarchyItem;
use Exception;
use Illuminate\Http\RedirectResponse;

class MetaHierarchyDeleteItemController extends Controller
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(MetaHierarchyDeleteItemRequest $request): RedirectResponse
    {
        try {
            // Find the item to delete
            $item = MetaHierarchyItem::where('meta_hierarchy_id', $request->metaHierarchyId)
                ->where('meta_data_id', $request->metaDataId)
                ->first();

            if (!$item) {
                return redirect()->back()->with(['error' => 'Meta Hierarchy Item not found.']);
            }

            // Delete the item
            $item->delete();

        } catch (Exception $exception) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        return redirect()
            ->back()
            ->with([
                'message' => 'Meta Hierarchy Item deleted successfully.',
            ]);
    }
}
