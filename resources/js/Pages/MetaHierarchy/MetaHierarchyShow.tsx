import { MetaHierarchy, MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import MetaHierarchyAddItem from '@/Components/MetaData/MetaHierarchy/MetaHierarchyAddItem'
import MetaHierarchyItemList from '@/Components/MetaData/MetaHierarchy/MetaHierarchyItemList'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyItems: MetaHierarchyItem[]
  currentNode: MetaHierarchyItem | null
}

export default function MetaHierarchyShow({ metaHierarchy, hierarchyItems, currentNode }: Props) {
  const displayItems = useMemo(() => {
    return [
      {
        label: 'Hierarchy',
        content: metaHierarchy.name,
        type: 'text',
        id: 1,
      },
      {
        label: 'Description',
        content: metaHierarchy.description,
        type: 'text',
        id: 2,
      },
    ] as ShowPageItem[]
  }, [metaHierarchy])

  return (
    <ShowResourcePage
      title={metaHierarchy.name}
      items={displayItems}
      backButtonUrl={route('meta-hierarchy.index')}
    >
      <MetaHierarchyAddItem metaHierarchy={metaHierarchy} />
      <MetaHierarchyItemList
        metaHierarchy={metaHierarchy}
        hierarchyItems={hierarchyItems}
        currentNode={currentNode}
      />
    </ShowResourcePage>
  )
}
