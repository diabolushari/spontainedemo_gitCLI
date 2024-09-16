import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import AlertMessage from '@/ui/Alert/AlertMessage'
import NormalText from '@/typograpy/NormalText'

interface Props {
  dataLoaderQuery: DataLoaderQuery
  error: boolean
  errorMessage: string
  result: Record<string, string | number | null | undefined | boolean>[]
}

export default function MetaGroupShow({
  dataLoaderQuery,
  error,
  errorMessage,
  result,
}: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderQuery.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: dataLoaderQuery.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'Connection',
        content: route('loader-connections.show', dataLoaderQuery.connection_id),
        contentDescription: dataLoaderQuery.loader_connection?.name ?? '',
        type: 'link',
      },
      {
        id: 4,
        label: 'Query',
        content: dataLoaderQuery.query,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [dataLoaderQuery])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-queries.index')}
      editUrl={route('loader-queries.edit', dataLoaderQuery.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      <Card className='my-10 py-5 px-2'>
        <AlertMessage
          variant={error ? 'error' : 'success'}
          message={errorMessage}
        />
        {result.length === 10 && <NormalText>Showing first 10 results.</NormalText>}
        <div className='bg-gray-200 w-full min-h-24'>
          <NormalText>
            [
            {result.map((item, index) => (
              <div key={index}>
                &nbsp;&nbsp;{'{'}
                {Object.entries(item).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex flex-row'
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;<NormalText>{key}: </NormalText>
                    <NormalText>{value}</NormalText>
                  </div>
                ))}
                &nbsp;&nbsp;{'}'}
              </div>
            ))}
            ]
          </NormalText>
        </div>
      </Card>
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${dataLoaderQuery.name}`}
          url={route('loader-queries.destroy', dataLoaderQuery.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
