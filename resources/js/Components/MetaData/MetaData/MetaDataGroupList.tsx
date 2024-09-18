import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import { MetaData, MetaDataGroup, MetaDataGroupItem } from '@/interfaces/meta_interfaces'
import { useState } from 'react'
import Modal from '@/ui/Modal/Modal'
import MetaGroupAddForm from '@/Pages/MetaData/MetaGroupAddForm'
import DeleteModal from '@/ui/Modal/DeleteModal'
import NormalText from '@/typograpy/NormalText'
import StrongText from '@/typograpy/StrongText'

interface Props {
  metaData: MetaData
  metaGroup: MetaDataGroup
}

export default function MetaDataGroupList({ metaData, metaGroup }: Readonly<Props>) {
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)

  const [selectedMetaDataGroupItem, setSelectedMetaDataGroupItem] =
    useState<MetaDataGroupItem | null>(null)

  const handleMetaDataGroupItemSelection = (metaDataGroupItem: MetaDataGroupItem) => {
    setSelectedMetaDataGroupItem(metaDataGroupItem)
    setShowDeleteGroupModal(true)
  }

  return (
    <>
      <Card className='mt-5'>
        <CardHeader
          title='Groups'
          onAddClick={() => {
            setShowAddGroupModal(true)
          }}
        />
        <div className='p-2'>
          <div className='flex flex-col gap-2 divide-y-2'>
            {metaData.group_item?.length === 0 && <div>No groups</div>}
            {metaData.group_item?.map((groupName) => (
              <div
                key={groupName.id}
                className='flex justify-between gap-5 flex-wrap gap-y-2'
              >
                <StrongText>{groupName.meta_data_group?.name}</StrongText>
                <button
                  className='text-red-500 hover:text-red-400'
                  onClick={() => handleMetaDataGroupItemSelection(groupName)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {showAddGroupModal && (
        <Modal
          setShowModal={setShowAddGroupModal}
          title='Add Meta Group'
        >
          <div className='p-2'>
            <MetaGroupAddForm
              metaDataId={metaData.id}
              metaGroup={metaGroup}
              setShowAddModal={setShowAddGroupModal}
            />
          </div>
        </Modal>
      )}
      {showDeleteGroupModal && selectedMetaDataGroupItem != null && (
        <DeleteModal
          setShowModal={setShowDeleteGroupModal}
          title='Remove Meta Hierarchy'
          url={route('meta-group-delete-item', selectedMetaDataGroupItem.id)}
        >
          <NormalText>
            Are you sure you want to delete {selectedMetaDataGroupItem.meta_data_group?.name}?
          </NormalText>
        </DeleteModal>
      )}
    </>
  )
}
