import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { DataLoaderJob, JobStatuses } from '@/interfaces/data_interfaces'
import { calculateNextRunTime } from '@/libs/jobSchedule'
import { Paginator } from '@/ui/ui_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import JobStatusesTable from '@/Components/DataLoader/Jobs/JobStatusesTable'
import JobDetailModal from '@/Components/DataLoader/Jobs/JobDetailModal'
import Modal from '@/ui/Modal/Modal'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  dataLoaderJob: DataLoaderJob
  statuses: Paginator<JobStatuses>
}

export default function MetaGroupShow({ dataLoaderJob, statuses }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<JobStatuses | null>(null)

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Loader job index',
      link: route('data-detail.show', {
        dataDetail: dataLoaderJob.data_detail_id,
        tab: 'jobs',
      }),
    },
    {
      item: 'Loader job',
      link: '',
    },
  ]

  const displayedValues = useMemo(() => {
    const data: ShowPageItem[] = [
      {
        id: 1,
        label: 'Name',
        content: dataLoaderJob.name,
        type: 'text',
      },
      { id: 2, label: 'Description', content: dataLoaderJob.description, type: 'text' },
      {
        id: 3,
        label: 'Target Table',
        content: route('data-detail.show', dataLoaderJob.data_detail_id),
        contentDescription: dataLoaderJob.detail?.name,
        type: 'link',
      },
      {
        id: 5,
        label: 'Cron Type',
        content: dataLoaderJob.cron_type,
        type: 'text',
      },
      {
        id: 10,
        label: 'Next Run',
        content: calculateNextRunTime(dataLoaderJob),
        type: 'text',
      },
    ]

    if (dataLoaderJob.cron_type === 'SUB_HOUR') {
      data.push(
        {
          id: 11,
          label: 'Max Retries',
          content: dataLoaderJob.retries?.toString() ?? '0',
          type: 'text',
        },
        {
          id: 12,
          label: 'Retry Interval (min)',
          content: dataLoaderJob.retries_interval?.toString() ?? '0',
          type: 'text',
        }
      )
    }

    if (dataLoaderJob.query_id != null) {
      data.push({
        id: 6,
        label: 'Query',
        content: route('loader-queries.show', dataLoaderJob.query_id),
        contentDescription: dataLoaderJob.loader_query?.name,
        type: 'link',
      })
    }

    if (dataLoaderJob.api_id != null) {
      data.push({
        id: 7,
        label: 'API',
        content: route('loader-apis.show', dataLoaderJob.api_id),
        contentDescription: dataLoaderJob.api?.name,
        type: 'link',
      })
    }

    return data
  }, [dataLoaderJob])

  const showDetails = (status: JobStatuses) => {
    setShowStatusModal(true)
    setSelectedStatus(status)
  }

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      // backUrl={route('data-detail.show', {
      //   dataDetail: dataLoaderJob.data_detail_id,
      //   tab: 'jobs',
      // })}
      onBackClick={() => history.back()}
      editUrl={route('loader-jobs.edit', dataLoaderJob.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
      type='data'
      subtype='data-tables'
      breadCrumbs={breadCrumb}
    >
      {showStatusModal && (
        <Modal
          setShowModal={setShowStatusModal}
          // title={selectedStatus?.executed_at}
        >
          <JobDetailModal selectedStatus={selectedStatus} />
        </Modal>
      )}

      <JobStatusesTable
        statuses={statuses.data}
        showDetails={showDetails}
      />
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
      <Pagination pagination={statuses} />
    </ShowResourcePage>
  )
}
