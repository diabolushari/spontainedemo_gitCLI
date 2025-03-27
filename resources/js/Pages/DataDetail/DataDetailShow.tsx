import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import DataTableExcelImport from '@/Components/DataDetail/DataTableExcelImport/DataTableExcelImport'
import DataTableFields from '@/Components/DataDetail/DataTableFields'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import CardGridView from '@/Components/ListingPage/CardGridView'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import SubsetList from '@/Components/Subset/SubsetList'
import {
  DataDetail,
  DataLoaderJob,
  DataTableItem,
  SubsetDetail,
} from '@/interfaces/data_interfaces'
import { MetaData } from '@/interfaces/meta_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DisplayTime, monthList } from '@/libs/dates'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Pagination from '@/ui/Pagination/Pagination'
import Tab from '@/ui/Tabs/Tab'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useMemo, useState } from 'react'

interface Props {
  detail: DataDetail
  dataTableItems: Paginator<DataTableItem>
  jobs: DataLoaderJob[]
  subsets: SubsetDetail[]
  tab?: string
}

const tabItems = [
  { name: 'Data', value: 'data' },
  { name: 'Loader Jobs', value: 'jobs' },
  { name: 'Fields', value: 'fields' },
  { name: 'Subset', value: 'subset' },
]

export default function DataDetailShow({
  detail,
  dataTableItems,
  jobs,
  tab = 'data',
  subsets,
}: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState(tab)
  const cronResult = (record: DataLoaderJob) => {
    if (record.cron_type === 'HOURLY') {
      return record.cron_type
    }
    if (record.cron_type === 'DAILY') {
      return 'DAILY, ' + DisplayTime(record.schedule_time)
    }
    if (record.cron_type === 'WEEKLY') {
      return 'WEEKLY, ' + record.day_of_week + ', ' + DisplayTime(record.schedule_time)
    }
    if (record.cron_type === 'MONTHLY') {
      return 'MONTHLY, Day ' + record.day_of_month + ', ' + DisplayTime(record.schedule_time)
    }
    if (record.cron_type === 'YEARLY') {
      const month = monthList.find((value) => {
        if (value.id === record.month_of_year) {
          return value
        }
      })
      return (
        'YEARLY, ' +
        month?.name +
        ', ' +
        record.day_of_month +
        ', ' +
        DisplayTime(record.schedule_time)
      )
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const data = useMemo(() => {
    return jobs.map((record) => ({
      id: record.id,
      name: record.name,
      description: record.description,
      status:
        record.latest != null
          ? record.latest?.is_successful == 1
            ? 'SUCCESS'
            : 'FAILED'
          : 'WAITING',
      cronType: cronResult(record),
      lastRun: record.latest != null ? 'Last run: ' + record.latest?.executed_at : '',
      rows: record.latest != null ? record.latest?.total_records + ' rows' : '',
      viewStyle:
        record.latest != null ? (record.latest?.is_successful == 1 ? 'bg-success' : 'bg-fail') : '',
      actions: [],
    }))
  }, [jobs])

  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        isShownInCard: true,
        boxStyles: 'mr-auto',
      },
      {
        key: 'status',
        isShownInCard: true,
        boxStyles: 'ml-auto',
      },
      { key: 'cronType', isShownInCard: true, boxStyles: 'col-span-2 mr-auto' },
      { key: 'description', isShownInCard: true, boxStyles: 'col-span-2 ml-2 line-clamp-1' },
      { key: 'lastRun', isShownInCard: true, boxStyles: 'min-w-full' },
      { key: 'rows', isShownInCard: true, boxStyles: 'ml-auto' },
    ] as ListItemKeys<Partial<MetaData>>[]
  }, [])

  const onAddClick = () => {
    router.get(route('loader-jobs.create', { dataDetail: detail.id }))
  }

  const handleJobCardClick = (id: number | string) => {
    router.get(route('loader-jobs.show', id))
  }
  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Data detail index',
      link: '/data-detail',
    },
    {
      item: 'Data detail',
      link: '',
    },
  ]
  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <CardHeader
            title={`Data Table: ${detail.name}`}
            backUrl={route('data-detail.index')}
            breadCrumb={breadCrumb}
            onDeleteClick={handleDeleteClick}
          />
          <Tab
            tabItems={tabItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === 'data' && (
            <>
              <div className='my-5 flex items-center justify-end gap-5'>
                <a
                  target='_blank'
                  href={route('export-data-table', detail.id)}
                  className='link'
                  rel='noreferrer'
                >
                  Export Data
                </a>
                <DataTableExcelImport dataDetail={detail} />
              </div>
              <div className='snap-y snap-mandatory'>
                <DataSetTable
                  dataDetail={detail}
                  dataTableItems={dataTableItems.data}
                />
              </div>
              <Pagination pagination={dataTableItems} />
            </>
          )}
          {activeTab == 'jobs' && (
            <CardGridView
              keys={keys}
              primaryKey='id'
              rows={data}
              onAddClick={onAddClick}
              onCardClick={handleJobCardClick}
              layoutStyles='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
            />
          )}
          {activeTab == 'subset' && (
            <SubsetList
              detail={detail}
              subsets={subsets}
            />
          )}
          {activeTab == 'fields' && <DataTableFields detail={detail} />}
        </div>
        {showDeleteModal && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${detail.name}`}
            url={route('data-detail.destroy', detail.id)}
          >
            <p>Are you sure you want to delete {detail.name}?</p>
          </DeleteModal>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
