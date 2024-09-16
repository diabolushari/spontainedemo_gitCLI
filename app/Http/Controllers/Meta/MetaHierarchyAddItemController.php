<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaHierarchyAddItemRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaHierarchyItem;
use Exception;
use Illuminate\Http\RedirectResponse;

class MetaHierarchyAddItemController extends Controller
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(MetaHierarchyAddItemRequest $request): RedirectResponse
    {
        $parentLevel = 0;
        if ($request->parentId != null) {
            $parent = MetaHierarchyItem::where('meta_hierarchy_id', $request->metaHierarchyId)
                ->where('meta_data_id', $request->parentId)
                ->first();

            if ($parent != null) {
                $parentLevel = $parent->level;
            }
        }

        try {
            MetaHierarchyItem::create([
                ...$request->all(),
                'level' => $parentLevel + 1,
            ]);
        } catch (Exception $exception) {
            return back()
                ->with(['error' => ExceptionMessage::getMessage($exception)]);
        }

        return redirect()
            ->back()
            ->with([
                'message' => 'Meta Hierarchy Item created successfully.',
            ]);

    }
}
