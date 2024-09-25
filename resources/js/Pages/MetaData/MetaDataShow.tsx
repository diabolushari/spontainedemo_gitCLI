import {
  MetaData,
  MetaDataGroup,
  MetaDataGroupItem,
  MetaHierarchy,
  MetaHierarchyItem,
} from '@/interfaces/meta_interfaces'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Modal from '@/ui/Modal/Modal'
import MetaGroupAddForm from './MetaGroupAddForm'
import MetaHierarchyAddForm from './MetaHierarchyAddForm'
import StrongText from '@/typograpy/StrongText'
import NormalText from '@/typograpy/NormalText'

interface Props {
  metaData: MetaData
  metaGroup: MetaDataGroup
  metaHierarchy: MetaHierarchy
}

export default function MetaDataShow({ metaData, metaGroup, metaHierarchy }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showAddHierarchyModal, setShowAddHierarchyModal] = useState(false)
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)
  const [showDeleteHierarchyModal, setShowDeleteHierarchyModal] = useState(false)

  const [selectedMetaDataGroupItem, setSelectedMetaDataGroupItem] =
    useState<MetaDataGroupItem | null>(null)

  const handleMetaDataGroupItemSelection = (metaDataGroupItem: MetaDataGroupItem) => {
    setSelectedMetaDataGroupItem(metaDataGroupItem)
    setShowDeleteGroupModal(true)
  }

  const [selectedMetaHierarchyItem, setSelectedMetaHierarchyItem] =
    useState<MetaHierarchyItem | null>(null)

  const handleMetaHierarchyItemSelection = (metaHierarchyItem: MetaHierarchyItem) => {
    setSelectedMetaHierarchyItem(metaHierarchyItem)
    setShowDeleteHierarchyModal(true)
  }

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
    <div className='p-8'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold'>METADATA</h1>
        <p className='text-sm text-gray-500'>
          Metadata Search {'>'} <span className='font-bold'>Value Details</span>
        </p>
      </div>
      <div className='rounded-md bg-blue-100 p-6 shadow-lg'>
        <div className='mb-4 flex justify-end gap-2'>
          <img
            src='/edit-icon.svg'
            alt='Delete'
            className='size-6 cursor-pointer justify-end'
            onClick={() => {
              window.location.href = route('meta-data.edit', metaData.id)
            }}
          />
          <img
            src='/trash-icon.svg'
            alt='Delete'
            className='size-6 cursor-pointer justify-end'
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h2 className='text-sm font-semibold text-gray-600'>VALUE NAME</h2>
            <p className='text-xl font-semibold'>{metaData.name}</p>
          </div>
          <div>
            <h2 className='text-sm font-semibold text-gray-600'>STRUCTURAL BLOCK</h2>
            <p className='text-xl font-semibold'>{metaData.meta_structure?.structure_name}</p>
          </div>
        </div>
        <div className='mt-4'>
          <h2 className='text-sm font-semibold text-gray-600'>DESCRIPTION</h2>
          <p className='text-md'>{metaData.description}</p>
        </div>
        <div className='flex justify-end space-x-4 text-xs'>
          <div
            onClick={() => {
              setShowAddGroupModal(true)
            }}
            className='cursor-pointer text-blue-500 underline'
          >
            ADD TO A GROUP
          </div>

          <div
            onClick={() => {
              setShowAddHierarchyModal(true)
            }}
            className='cursor-pointer text-blue-500 underline'
          >
            ADD TO A HIERARCHY
          </div>
        </div>
      </div>
      <div className='bg-white-100 rounded-md p-6'>
        <h1 className='text-lg'>
          {metaData.name} is a member of the following <b>groups:</b>
        </h1>
        <div className='flex flex-col gap-2 divide-y-2'>
          {metaData.group_item?.length === 0 && <div>No groups</div>}
          {metaData.group_item?.map((groupName) => (
            <div
              key={groupName.id}
              className='flex justify-between gap-5 gap-y-2'
            >
              <StrongText>{groupName.meta_data_group?.name}</StrongText>
              <img
                src='/trash-icon.svg'
                alt='Delete'
                className='size-6 cursor-pointer'
                onClick={() => handleMetaDataGroupItemSelection(groupName)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className='bg-white-100 rounded-md p-6'>
        <h1 className='text-lg'>
          {metaData.name} is a member of the following <b>dimensional hierarchies:</b>
        </h1>
        <div className='p-2'>
          <div className='flex flex-col gap-2 divide-y-2'>
            {metaData.hierarchy_item?.length === 0 && <div>No hierarchys</div>}
            {metaData.hierarchy_item?.map((hierarchyName) => (
              <div
                key={hierarchyName.id}
                className='flex justify-between gap-5 gap-y-2'
              >
                <StrongText>{hierarchyName.meta_hierarchy?.name}</StrongText>
                <img
                  src='/trash-icon.svg'
                  alt='Delete'
                  className='size-6 cursor-pointer'
                  onClick={() => handleMetaHierarchyItemSelection(hierarchyName)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
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
          title='Remove Meta Group'
          url={route('meta-group-delete-item', selectedMetaDataGroupItem.id)}
        >
          <NormalText>
            Are you sure you want to delete {selectedMetaDataGroupItem.meta_data_group?.name}?
          </NormalText>
        </DeleteModal>
      )}
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

      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaData.name}`}
          url={route('meta-data.destroy', metaData.id)}
        >
          <p>Are you sure you want to delete {metaData.name}?</p>
        </DeleteModal>
      )}
    </div>
  )
}
