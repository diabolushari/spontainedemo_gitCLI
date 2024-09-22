<?php

namespace App\Services\MetaData\Hierarchy;

use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Support\Collection;

readonly class HierarchyChildList
{
    public function __construct(
        public readonly HierarchyList $metaHierarchyList
    ) {}

    /**
     * @return Collection<MetaHierarchyItem>
     */
    public function getChilds(MetaHierarchyItem $hierarchyItem): Collection
    {

        $hierarchy = MetaHierarchy::find($hierarchyItem->meta_hierarchy_id);
        if ($hierarchy == null) {
            return collect([]);
        }

        /**
         * @var MetaHierarchyItem[] $childList
         */
        $childList = [];
        $reachedParentNode = false;
        $hierarchyList = $this->metaHierarchyList->getHierarchy($hierarchy);

        foreach ($hierarchyList as $item) {
            if ($item->id === $hierarchyItem->id) {
                $reachedParentNode = true;

                continue;
            }

            if ($reachedParentNode && $item->level <= $hierarchyItem->level) {
                break;
            }

            if ($reachedParentNode) {
                $childList[] = $item;
            }

        }

        return collect($childList);

    }
}
