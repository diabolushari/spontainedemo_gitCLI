import MetaHierarchyTree from '@/Components/MetaData/MetaHierarchy/MetaHierarchyTree'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import {
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyList: MetaHierarchyItem[]
  levelInfos: MetaHierarchyLevelInfo[]
}

export default function MetaHierarchyShow({
  metaHierarchy,
  hierarchyList,
  levelInfos,
}: Readonly<Props>) {
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
      backUrl={route('meta-hierarchy.index', { type: 'definitions', subtype: 'heirarchies' })}
      editUrl={route('meta-hierarchy.edit', metaHierarchy.id)}
      deleteUrl={route('meta-hierarchy.destroy', metaHierarchy.id)}
    >
      <MetaHierarchyTree
        metaHierarchy={metaHierarchy}
        hierarchyList={hierarchyList}
        levelInfos={levelInfos}
      />
    </ShowResourcePage>
  )
}
