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
    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      executed_at: job.last_status?.executed_at ?? 'N/A',
      status:
        job.last_status?.is_successful === 1
          ? `Inserted ${job.last_status.total_records ?? 0} Records.`
          : (job.last_status?.error_message ?? ''),
      actions: [],
    }))
  }, [jobs])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'executed_at', label: 'Executed At', isShownInCard: true },
      { key: 'status', label: 'Status', isShownInCard: true, hideLabel: true },
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
