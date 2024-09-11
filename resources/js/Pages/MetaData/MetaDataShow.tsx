import { MetaData, MetaDataGroup, MetaHierarchy } from '@/interfaces/meta_interfaces'
import { useMemo, useState } from 'react'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Modal from '@/ui/Modal/Modal'
import MetaGroupAddForm from './MetaGroupAddForm'
import MetaHierarchyAddForm from './MetaHierarchyAddForm'

interface Props {
  metaData: MetaData
  metaGroup: MetaDataGroup
  metaHierarchy: MetaHierarchy
}

export default function MetaDataShow({ metaData, metaGroup, metaHierarchy }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showAddHierarchyModal, setShowAddHierarchyModal] = useState(false)

  const displayedItems: ShowPageItem[] = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: metaData.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: metaData.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'Structure',
        contentDescription: metaData.meta_structure?.structure_name,
        content: route('meta-data.index', {
          structure: metaData.meta_structure?.id,
        }),
        type: 'link',
      },
      {
        id: 4,
        label: 'Created At',
        content: metaData.created_at,
        type: 'date',
      },
      {
        id: 5,
        label: 'Updated At',
        content: metaData.updated_at,
        type: 'date',
      },
    ]
  }, [metaData])

  return (
    <ShowResourcePage
      items={displayedItems}
      title={metaData.name}
      backUrl={route('meta-data.index')}
      editUrl={route('meta-data.edit', metaData.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      <>
        <Card className='mt-5'>
          <CardHeader
            title='Groups'
            onAddClick={() => {
              setShowAddGroupModal(true)
            }}
          />
          <div className='p-2'>
            <div className='flex flex-col gap-2'>
              {metaData.group_item?.length === 0 && <div>No groups</div>}
              {metaData.group_item?.map((groupName) => (
                <div key={groupName.id}>{groupName.meta_data_group?.name}</div>
              ))}
            </div>
          </div>
        </Card>
        <Card className='mt-5'>
          <CardHeader
            title='Hierarchy'
            onAddClick={() => {
              setShowAddHierarchyModal(true)
            }}
          />
          <div className='p-2'>
            <div className='flex flex-col gap-2'>
              {metaData.hierarchy_item?.length === 0 && <div>No hierarchy</div>}
              {metaData.hierarchy_item?.map((hierarchyName) => (
                <div key={hierarchyName.id}>{hierarchyName.meta_hierarchy?.name}</div>
              ))}
            </div>
          </div>
        </Card>
      </>
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaData.name}`}
          url={route('meta-data.destroy', metaData.id)}
        >
          <p>Are you sure you want to delete {metaData.name}?</p>
        </DeleteModal>
      )}
      {showAddGroupModal && (
        <Modal
          setShowModal={setShowAddGroupModal}
          title='Add Meta Group'
        >
          <MetaGroupAddForm
            metaDataId={metaData.id}
            metaGroup={metaGroup}
          />
        </Modal>
      )}
      {showAddHierarchyModal && (
        <Modal
          setShowModal={setShowAddHierarchyModal}
          title='Add Meta Hierarchy'
        >
          <MetaHierarchyAddForm
            metaDataId={metaData.id}
            metaHierarchy={metaHierarchy}
          />
        </Modal>
      )}
    </ShowResourcePage>
  )
}
