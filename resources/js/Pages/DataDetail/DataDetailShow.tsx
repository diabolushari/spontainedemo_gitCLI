import { DataDetail, DataLoaderJob, DataTableItem } from '@/interfaces/data_interfaces'
import { useMemo, useState } from 'react'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import DataTableExcelImport from '@/Components/DataDetail/DataTableExcelImport/DataTableExcelImport'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import Tab from '@/ui/Tabs/Tab'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { MetaData } from '@/interfaces/meta_interfaces'
import CardGridView from '@/Components/ListingPage/CardGridView'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import { router } from '@inertiajs/react'

interface Props {
  detail: DataDetail
  dataTableItems: Paginator<DataTableItem>
  jobs: DataLoaderJob[]
  tab?: string
}

const tabItems = [
  { name: 'Data', value: 'data' },
  { name: 'Loader Jobs', value: 'jobs' },
]

export default function DataDetailShow({
  detail,
  dataTableItems,
  jobs,
  tab = 'data',
}: Readonly<Props>) {
  const [activeTab, setActiveTab] = useState(tab)

  const data = useMemo(() => {
    return jobs.map((record) => ({
      id: record.id,
      name: record.name,
      description: record.description,
      status: record.latest?.is_successful == 1 ? 'WAITING' : 'FAILED',
      cronType:
        record.cron_type != null
          ? record.cron_type
          : '' + ' ' + record.schedule_time != null
            ? record.schedule_time
            : '',
      lastRun: 'Last run: ' + record.latest?.executed_at,
      rows: record.latest?.total_records + ' rows',
      viewStyle: record.latest?.is_successful == 1 ? '' : 'bg-[#DA999A]',
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
      { key: 'description', isShownInCard: true, boxStyles: 'col-span-2' },
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

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <CardHeader
            title={`Data Table: ${detail.name}`}
            backUrl={route('data-detail.index', { type: 'data', subtype: 'data-tables' })}
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
              <DataSetTable
                dataDetail={detail}
                dataTableItems={dataTableItems.data}
              />
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
            />
          )}
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
