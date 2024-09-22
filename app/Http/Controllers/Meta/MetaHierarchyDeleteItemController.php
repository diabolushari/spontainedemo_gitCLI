<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaHierarchyItem;
use App\Services\MetaData\Hierarchy\HierarchyChildList;
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

    public function __invoke(MetaHierarchyItem $metaHierarchyItem, HierarchyChildList $hierarchyChildList): RedirectResponse
    {
        try {
            $childList = $hierarchyChildList->getChilds($metaHierarchyItem);
            $recordstoBeDeleted = [$metaHierarchyItem->id];
            MetaHierarchyItem::whereIn('id', array_merge($recordstoBeDeleted, $childList->pluck('id')->toArray()))
                ->delete();
        } catch (Exception $e) {
            return redirect()->back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->back()->with([
            'message' => 'Meta Data removed from Hierarchy',
        ]);
    }
}
