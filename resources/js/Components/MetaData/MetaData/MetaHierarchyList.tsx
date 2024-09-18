import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import { MetaData, MetaHierarchy, MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import { useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import DeleteModal from '@/ui/Modal/DeleteModal'
import NormalText from '@/typograpy/NormalText'
import StrongText from '@/typograpy/StrongText'
import MetaHierarchyAddForm from '@/Pages/MetaData/MetaHierarchyAddForm'

interface Props {
  metaData: MetaData
  metaHierarchy: MetaHierarchy
}

export default function MetaHierarchyList({ metaData, metaHierarchy }: Readonly<Props>) {
  const [showAddHierarchyModal, setShowAddHierarchyModal] = useState(false)
  const [showDeleteHierarchyModal, setShowDeleteHierarchyModal] = useState(false)

  const [selectedMetaHierarchyItem, setSelectedMetaHierarchyItem] =
    useState<MetaHierarchyItem | null>(null)

  const handleMetaHierarchyItemSelection = (metaHierarchyItem: MetaHierarchyItem) => {
    setSelectedMetaHierarchyItem(metaHierarchyItem)
    setShowDeleteHierarchyModal(true)
  }

  return (
    <>
      <Card className='mt-5'>
        <CardHeader
          title='Hierarchy'
          onAddClick={() => {
            setShowAddHierarchyModal(true)
          }}
        />
        <div className='p-2'>
          <div className='flex flex-col gap-2 divide-y-2'>
            {metaData.hierarchy_item?.length === 0 && <div>No hierarchys</div>}
            {metaData.hierarchy_item?.map((hierarchyName) => (
              <div
                key={hierarchyName.id}
                className='flex justify-between gap-5 flex-wrap gap-y-2'
              >
                <StrongText>{hierarchyName.meta_hierarchy?.name}</StrongText>
                <button
                  className='text-red-500 hover:text-red-400'
                  onClick={() => handleMetaHierarchyItemSelection(hierarchyName)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {showAddHierarchyModal && (
        <Modal
          setShowModal={setShowAddHierarchyModal}
          title='Add Meta Hierarchy'
        >
          <div className='p-2'>
            <MetaHierarchyAddForm
              metaDataId={metaData.id}
              metaHierarchy={metaHierarchy}
            />
          </div>
        </Modal>
      )}
      {showDeleteHierarchyModal && selectedMetaHierarchyItem != null && (
        <DeleteModal
          setShowModal={setShowDeleteHierarchyModal}
          title='Remove Meta Hierarchy'
          url={route('meta-hierarchy-delete-item', selectedMetaHierarchyItem.id)}
        >
          <NormalText>
            Are you sure you want to delete {selectedMetaHierarchyItem.meta_hierarchy?.name}?
          </NormalText>
        </DeleteModal>
      )}
    </>
  )
}
