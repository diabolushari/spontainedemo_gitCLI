import { MetaData } from '@/interfaces/meta_interfaces'
import { useMemo, useState } from 'react'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import StrongText from '@/typograpy/StrongText'
import DeleteModal from '@/ui/Modal/DeleteModal'
import EditButton from '@/ui/button/EditButton'

interface Props {
  metaData: MetaData
}

export default function MetaDataShow({ metaData }: Props) {
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
  const hierarchyNames =
    metaData.hierarchy_item?.map((item) => item.meta_hierarchy?.name).filter(Boolean) || []
  const groupNames = metaData.group_item?.map((item) => item.meta_group?.name).filter(Boolean) || []

  console.log(hierarchyNames)
  console.log(metaData)
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
            onAddClick={() => {}}
          />
          <div className='p-2'>
            <div>{groupNames}</div>
          </div>
        </Card>
        <Card className='mt-5'>
          <CardHeader
            title='Hierarchy'
            onAddClick={() => {}}
          />
          <div className='p-2'>
            <div>{hierarchyNames}</div>
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
    </ShowResourcePage>
  )
}
