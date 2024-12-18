import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useCallback, useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import AlertMessage from '@/ui/Alert/AlertMessage'
import NormalText from '@/typography/NormalText'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { getHttpError } from '@/ui/alerts'
import axios from 'axios'
import Button from '@/ui/button/Button'

interface Props {
  dataLoaderQuery: DataLoaderQuery
}

export default function DataLoaderQueryShow({ dataLoaderQuery }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [error, setError] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [result, setResult] = useState<
    Record<string, string | number | null | undefined | boolean>[]
  >([])
  const [loading, setLoading] = useState(false)

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Extraction statement index',
      link: route('loader-queries.index', { type: 'loaders', subtype: 'queries' }),
    },
    {
      item: 'Extraction statement',
      link: '',
    },
  ]

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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result: {
        data: {
          error: boolean
          errorMessage: string
          result: Record<string, string | number | null | undefined | boolean>[]
        }
      } = await axios.get(route('loader-query-data', dataLoaderQuery.id))
      setError(result.data.error)
      setStatusMessage(result.data.errorMessage)
      setResult(result.data.result ?? [])
    } catch (error) {
      console.log(error)
      setError(true)
      const errorData = getHttpError(error)
      if (errorData != null) {
        setStatusMessage(errorData)
      }
    } finally {
      setLoading(false)
    }
  }, [dataLoaderQuery])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-queries.index', { type: 'loaders', subtype: 'queries' })}
      editUrl={route('loader-queries.edit', dataLoaderQuery.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
      type='loaders'
      subtype='queries'
      breadCrumbs={breadCrumb}
    >
      <Card className='my-10 px-2 py-5'>
        <div className='my-5 flex'>
          <Button
            label='Test Query'
            onClick={fetchData}
            processing={loading}
          />
        </div>
        {statusMessage != null && (
          <AlertMessage
            variant={error ? 'error' : 'success'}
            message={statusMessage}
          />
        )}
        {result.length === 10 && <NormalText>Showing first 10 results.</NormalText>}
        {statusMessage != null && (
          <div className='min-h-24 w-full bg-gray-200'>
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
        )}
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
