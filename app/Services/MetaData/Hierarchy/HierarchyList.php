<?php

namespace App\Services\MetaData\Hierarchy;

use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Collection;

/**
 * Het MetaHierarchyItem List order by level and childs placed right after parent
 */
class HierarchyList
{
    /** @var Collection<int, MetaHierarchyItem> */
    private Collection $hierarchyItems;

    public function getHierarchy(MetaHierarchy $metaHierarchy): array
    {

        $this->hierarchyItems = MetaHierarchyItem::where('meta_hierarchy_id', $metaHierarchy->id)
            ->with('primaryField:id,name')
            ->with('secondaryField:id,name')
            ->orderBy('level')
            ->get();

        /**
         * @var MetaHierarchyItem[] $hierarchy
         */
        $hierarchy = [];

        $this->hierarchyItems->filter(fn (MetaHierarchyItem $item) => $item->parent_id === null)
            ->each(function (MetaHierarchyItem $item) use (&$hierarchy) {
                $this->insertIntoList($hierarchy, $item);
            });

        return $hierarchy;
    }

    private function insertIntoList(array &$list, MetaHierarchyItem $item): void
    {
        $list[] = $item;
        $this->hierarchyItems->filter(fn (MetaHierarchyItem $child) => $child->parent_id === $item->id)
            ->each(function (MetaHierarchyItem $child) use (&$list) {
                $this->insertIntoList($list, $child);
            });
    }
}
