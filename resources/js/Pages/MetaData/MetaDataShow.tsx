import { MetaData, MetaDataGroup, MetaHierarchy } from '@/interfaces/meta_interfaces'
import { useMemo, useState } from 'react'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import DeleteModal from '@/ui/Modal/DeleteModal'
import MetaDataGroupList from '@/Components/MetaData/MetaData/MetaDataGroupList'
import MetaHierarchyList from '@/Components/MetaData/MetaData/MetaHierarchyList'

interface Props {
  metaData: MetaData
  metaGroup: MetaDataGroup
  metaHierarchy: MetaHierarchy
}

export default function MetaDataShow({ metaData, metaGroup, metaHierarchy }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
      <MetaDataGroupList
        metaData={metaData}
        metaGroup={metaGroup}
      />
      <MetaHierarchyList
        metaData={metaData}
        metaHierarchy={metaHierarchy}
      />

      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaData.name}`}
          url={route('meta-data.destroy', metaData.id)}
        >
          <p>Are you sure you want to delete {metaData.name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
