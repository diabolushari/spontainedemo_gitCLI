import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import DataSourcePreview from '@/Components/DataLoader/DataSourcePreview/DataSourcePreview'

interface Props {
  dataLoaderQuery: DataLoaderQuery
}

export default function DataLoaderQueryShow({ dataLoaderQuery }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
      <DataSourcePreview url={route('loader-query-data', dataLoaderQuery.id)} />
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
