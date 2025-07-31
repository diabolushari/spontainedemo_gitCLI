import { DataDetail, DataTableItem } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import DataTableExcelImport from '@/Components/DataDetail/DataTableExcelImport/DataTableExcelImport'
import DataDetailFilter from '@/Components/DataDetail/Filter/DataDetailFilter'
import Pagination from '@/ui/Pagination/Pagination'
import React from 'react'

interface DataDetailTableSectionProps {
  readonly detail: DataDetail
  readonly filters: Readonly<Record<string, string | undefined | null>>
  readonly dataTableItems: Paginator<DataTableItem>
  readonly onSubmit: (filters: Readonly<Record<string, string>>) => void
}

export default function DataDetailTableSection({
  detail,
  filters,
  dataTableItems,
  onSubmit,
}: Readonly<DataDetailTableSectionProps>) {
  const handleFilterSubmit = (queryString: string | null): void => {
    if (!queryString) {
      onSubmit({})
      return
    }

    const params = new URLSearchParams(queryString)
    const filters: Record<string, string> = {}

    for (const [key, value] of params.entries()) {
      if (value) {
        filters[key] = value
      }
    }

    onSubmit(filters)
  }
  return (
    <>
      <div className='mb-4'>
        <DataDetailFilter
          details={detail}
          filters={filters}
          onSubmit={handleFilterSubmit}
        />
      </div>
      <div className='my-5 flex items-center justify-end gap-5'>
        <a
          target='_blank'
          href={`/export-data-table/${detail.id}`}
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
  )
}
