import {
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import handleEnterPress from '@/libs/handle-enter'
import StrongText from '@/typograpy/StrongText'
import { useCallback, useMemo, useState } from 'react'
import MetaHierarchyAddItem from './MetaHierarchyAddItem'
import MetaHierarchyTreeNode from './MetaHierarchyTreeNode'
import useMetaTree from './useMetaTree'

interface Props {
  hierarchyList: MetaHierarchyItem[]
  metaHierarchy: MetaHierarchy
  levelInfos: MetaHierarchyLevelInfo[]
}

export default function MetaHierarchyTree({
  hierarchyList,
  metaHierarchy,
  levelInfos,
}: Readonly<Props>) {
  const { tree, toggleNode } = useMetaTree(hierarchyList)

  const [selectedNode, setSelectedNode] = useState<MetaHierarchyItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  const openAddNodeModal = useCallback((node: MetaHierarchyItem | null) => {
    setSelectedNode(node)
    setShowModal(true)
  }, [])

  const firstLevelInfo = useMemo(() => {
    return levelInfos.find((info) => info.level == 1)
  }, [levelInfos])

  return (
    <div className='mt-10 flex w-full flex-col justify-center gap-5'>
      <div className='flex w-10/12 flex-col gap-2 lg:w-7/12 xl:w-6/12'>
        {tree.map((item) => (
          <MetaHierarchyTreeNode
            key={item.nodeId}
            node={item}
            toggleNode={toggleNode}
            openAddNodeModal={openAddNodeModal}
          />
        ))}
        <div
          role='treeitem'
          aria-selected={false}
          onClick={() => openAddNodeModal(null)}
          onKeyUp={(event) => handleEnterPress(event, () => openAddNodeModal(null))}
          tabIndex={0}
          className='mx-2 flex grow cursor-pointer items-center justify-center gap-5 border border-blue-700 p-1 hover:border-green-500 hover:text-green-500 hover:shadow'
        >
          <StrongText>
            <i className='las la-plus-circle'></i> Add{' '}
            {firstLevelInfo?.structure?.structure_name ?? 'New Item'}
          </StrongText>
        </div>
      </div>
      {showModal && (
        <MetaHierarchyAddItem
          currentNode={selectedNode}
          setShowModal={setShowModal}
          metaHierarchy={metaHierarchy}
          levelInfos={levelInfos}
        />
      )}
    </div>
  )
}
