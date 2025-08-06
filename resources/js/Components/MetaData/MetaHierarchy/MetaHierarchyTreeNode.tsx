import { MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import handleEnterPress from '@/libs/handle-enter'
import StrongText from '@/typography/StrongText'
import SubHeading from '@/typography/SubHeading'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useCallback, useState } from 'react'
import { MetaTreeNodeData } from './useMetaTree'

interface Props {
  node: MetaTreeNodeData
  toggleNode: (nodeId: number) => void
  openAddNodeModal: (node: MetaHierarchyItem | null) => void
}

export default function MetaHierarchyTreeNode({
  node,
  toggleNode,
  openAddNodeModal,
}: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const onDeleteCompletion = useCallback(() => {
    setShowDeleteModal(false)
  }, [])

  return (
    <>
      {node.visible && (
        <div
          key={node.nodeId}
          className='flex items-center gap-2 p-1 px-2'
        >
          {node.level != 1 && (
            <div
              style={{
                width: `${node.level * 2}rem`,
              }}
              className=''
            ></div>
          )}
          <div className='tree-node flex grow rounded border border-1stop-link p-1'>
            <div
              role='treeitem'
              aria-selected={node.expanded}
              onClick={() => toggleNode(node.nodeId)}
              onKeyUp={(event) => handleEnterPress(event, () => toggleNode(node.nodeId))}
              tabIndex={0}
              className='tree-node-content flex grow cursor-pointer hover:text-1stop-highlight'
            >
              <StrongText>
                {node.nodePrimaryValue} | {node.nodeSecondaryValue} | {node.levelName}
              </StrongText>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => openAddNodeModal(node.record ?? null)}
                className='small-1stop text-1stop-link underline hover:text-cyan-800'
              >
                {/* <i className='las la-plus'></i> */}
                Add child
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className='text-red-500 hover:text-red-700'
              >
                <i className='las la-trash'></i>
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <DeleteModal
          url={route('meta-hierarchy-delete-item', node.nodeId)}
          setShowModal={setShowDeleteModal}
          onSuccess={onDeleteCompletion}
          title={`Delete ${node.nodePrimaryValue}`}
          preserveState
          large
        >
          <SubHeading className='red-text-500'>
            This node contains child elements. Deleting it will remove all child nodes from this
            hierarchy. Are you sure?
          </SubHeading>
        </DeleteModal>
      )}
    </>
  )
}
