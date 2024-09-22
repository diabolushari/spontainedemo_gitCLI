import MetaHierarchyTree from '@/Components/MetaData/MetaHierarchy/MetaHierarchyTree'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { MetaHierarchy, MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyList: MetaHierarchyItem[]
}

export default function MetaHierarchyShow({ metaHierarchy, hierarchyList }: Readonly<Props>) {
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
      backUrl={route('meta-hierarchy.index')}
    >
      <MetaHierarchyTree
        metaHierarchy={metaHierarchy}
        hierarchyList={hierarchyList}
      />
    </ShowResourcePage>
  )
}
