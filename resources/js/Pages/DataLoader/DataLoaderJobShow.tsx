import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderJob } from '@/interfaces/data_interfaces'

interface Props {
  dataLoaderJob: DataLoaderJob
}

export default function MetaGroupShow({ dataLoaderJob }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  console.log(dataLoaderJob)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderJob.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Target Table',
        content: route('data-detail.show', dataLoaderJob.data_detail_id),
        contentDescription: dataLoaderJob.detail?.name,
        type: 'link',
      },
      {
        id: 3,
        label: 'Query',
        content: route('loader-queries.show', dataLoaderJob.query_id),
        contentDescription: dataLoaderJob.loader_query?.name,
        type: 'link',
      },
      {
        id: 4,
        label: 'Cron Type',
        content: dataLoaderJob.cron_type,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('loader-jobs.index')}
      editUrl={route('loader-jobs.edit', dataLoaderJob.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete Record`}
          url={route('loader-jobs.destroy', dataLoaderJob.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
