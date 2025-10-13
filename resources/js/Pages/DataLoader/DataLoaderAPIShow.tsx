import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import DataSourcePreview from '@/Components/DataLoader/DataSourcePreview/DataSourcePreview'

interface Props {
  dataLoaderAPI: DataLoaderAPI
}

export default function MetaGroupShow({ dataLoaderAPI }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderAPI.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: dataLoaderAPI.description,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [dataLoaderAPI])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-apis.index')}
      editUrl={route('loader-apis.edit', dataLoaderAPI.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
      type={'loaders'}
      subtype={'json-apis'}
    >
      <DataSourcePreview url={route('loader-json-api-data', dataLoaderAPI.id)} />
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete Record`}
          url={route('loader-apis.destroy', dataLoaderAPI.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
