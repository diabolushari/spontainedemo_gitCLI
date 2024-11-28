import useFetchRecord from '@/hooks/useFetchRecord'
import { Model } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Paginator } from '@/ui/ui_interfaces'
import React, { useEffect, useState } from 'react'

interface Properties {
  subset_id: string
  column1: string
  column2: string
  displayKey?: string
  default_level?: string
  sortBy?: string
  sortOrder?: string
}
const listTypes: { name: string }[] = [
  { name: 'Top 3' },
  { name: 'Top 5' },
  { name: 'Top 10' },
  { name: 'Top 20' },
  { name: 'Bottom 10' },
]
const levelTypes: { name: string; value: string }[] = [
  { name: 'Division', value: 'division' },
  { name: 'Subdivision', value: 'subdivision' },
  { name: 'Circle', value: 'circle' },
  { name: 'Region', value: 'region' },
  { name: 'Section', value: 'section' },
]
interface ConsumerList extends Model {
  office_code: string
  office_name: string
  complaint_count?: number
  consumer_count?: number
  sla_perf_cnt?: number
  requests_within_sla__count_?: string
}
const TopList = ({
  subset_id,
  column1,
  column2,
  displayKey,
  default_level,
  sortBy = 'consumer_count',
  sortOrder = 'desc',
}: Properties) => {
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState([column1, column2])
  const [topOrBottom, setTopOrBottom] = useState(sortOrder)
  const [listType, setListType] = useState('Top 10')
  const [officeLevel, setOfficeLevel] = useState(default_level ?? 'division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/${subset_id}?level=${officeLevel}&sort_by=${sortBy}&sort_order=${topOrBottom}&limit=${listType.split(' ')[1]}&page=${page}`
    // 'subset-summary/82?level=section&sort_by=requests_within_sla__count_&sort_order=desc&limit=10'
  )

  useEffect(() => {
    setHeaders([levelTypes.find((value) => value.value == officeLevel)?.name ?? column1, column2])
  }, [officeLevel, column1, column2])
  const displayValue = (value: ConsumerList) => {
    switch (displayKey) {
      case 'consumer_count':
        return value.consumer_count
      case 'complaint_count':
        return value.complaint_count
      case 'sla':
        return value.sla_perf_cnt
      case 'sla_count':
        return value.requests_within_sla__count_
      default:
        return value.consumer_count
    }
  }
  const setSortOrder = (value: string) => {
    if (value.split(' ')[0] != 'Top') {
      setTopOrBottom('asc')
    } else {
      setTopOrBottom('desc')
    }
    setListType(value)
  }
  console.log(graphValues)
  return (
    <div className='mt-5 flex w-full flex-col p-2'>
      <div className='items center flex justify-center gap-5'>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            value={listType}
            setValue={setSortOrder}
            dataKey='name'
            displayKey='name'
            style='1stop-small'
          />
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={levelTypes}
            value={officeLevel}
            setValue={setOfficeLevel}
            dataKey='value'
            displayKey='name'
            style='1stop-small'
          />
        </div>
      </div>
      <table className='mt-5'>
        <thead className='rounded-2xl text-left'>
          <tr className=''>
            {headers.map((header) => {
              return (
                <th
                  key={header}
                  className='small-1stop bg-1stop-white'
                >
                  {header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {graphValues?.data.data.map((value) => {
            return (
              <tr
                className='small-1stop text-left'
                key={value.office_name}
              >
                <td className=''>{value.office_name}</td>
                <td className=''>{displayValue(value)}</td>
              </tr>
            )
          })}
        </tbody>
        {graphValues?.data != null && (
          <RestPagination
            pagination={graphValues.data}
            onNewPage={setPage}
          />
        )}
      </table>
    </div>
  )
}

export default TopList
