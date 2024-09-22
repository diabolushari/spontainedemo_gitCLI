import { MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import handleEnterPress from '@/libs/handle-enter'
import StrongText from '@/typograpy/StrongText'
import SubHeading from '@/typograpy/SubHeading'
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
    // eslint-disable-next-line sonarjs/jsx-no-useless-fragment
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
          <div className='tree-node flex grow border border-blue-700 p-1'>
            <div
              role='treeitem'
              aria-selected={node.expanded}
              onClick={() => toggleNode(node.nodeId)}
              onKeyUp={(event) => handleEnterPress(event, () => toggleNode(node.nodeId))}
              tabIndex={0}
              className='tree-node-content flex grow cursor-pointer'
            >
              <StrongText>{node.nodeName}</StrongText>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => openAddNodeModal(node.record ?? null)}
                className='text-green-500 hover:text-green-700'
              >
                <i className='las la-plus'></i>
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
          title={`Delete ${node.nodeName}`}
          preserveState
        >
          <SubHeading className='red-text-500'>
            Are you sure you want to delete <strong>{node.nodeName}</strong> and all its childern?
          </SubHeading>
        </DeleteModal>
      )}
    </>
  )
}
