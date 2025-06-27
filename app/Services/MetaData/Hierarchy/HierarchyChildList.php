<?php

namespace App\Services\MetaData\Hierarchy;

use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Support\Collection;

class HierarchyChildList
{
    /** @var \Illuminate\Database\Eloquent\Collection<int, MetaHierarchyItem> */
    private Collection $hierarchyItems;

    public function __construct(
    ) {}

    /**
     * @return Collection<MetaHierarchyItem>
     */
    public function getChildren(MetaHierarchyItem $hierarchyItem): Collection
    {

        $this->hierarchyItems = MetaHierarchyItem::where('meta_hierarchy_id', $hierarchyItem->meta_hierarchy_id)
            ->where('level', '>', $hierarchyItem->level)
            ->with('primaryField:id,name')
            ->orderBy('level')
            ->get();

        /**
         * @var MetaHierarchyItem[] $hierarchy
         */
        $hierarchy = [];

        $this->hierarchyItems->filter(fn (MetaHierarchyItem $item) => $item->parent_id === $hierarchyItem->id)
            ->each(function (MetaHierarchyItem $item) use (&$hierarchy) {
                $this->insertIntoList($hierarchy, $item);
            });

        return collect($hierarchy);
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
