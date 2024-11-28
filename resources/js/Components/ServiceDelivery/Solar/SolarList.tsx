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
  capacity_kw: number
}

const list: {
  voltage: string
  value: string
}[] = [
  { voltage: 'LT', value: 'LT' },
  { voltage: 'HT', value: 'HT' },
  { voltage: 'Total', value: '' },
]
const SolarList = ({
  subset_id,
  column1,
  column2,
  default_level,
  sortBy,
  sortOrder = 'desc',
}: Properties) => {
  const [page, setPage] = useState(1)
  const [topOrBottom, setTopOrBottom] = useState(sortOrder)
  const [headers, setHeaders] = useState([column1, column2])
  const [listType, setListType] = useState('Top 10')

  const [title, setTitle] = useState('')
  const [officeLevel, setOfficeLevel] = useState(default_level ?? 'division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/${subset_id}?level=${officeLevel}&sort_by=${sortBy ?? 'complaint_count'}&voltage=${title}&sort_order=${topOrBottom ?? 'desc'}&limit=${listType.split(' ')[1]}&page=${page}`
  )

  useEffect(() => {
    setHeaders([levelTypes.find((value) => value.value == officeLevel)?.name ?? column1, column2])
  }, [officeLevel, column1, column2])
  const setSortOrder = (value: string) => {
    console.log(value)
    if (value.split(' ')[0] != 'Top') {
      setTopOrBottom('asc')
    } else {
      setTopOrBottom('desc')
    }
    setListType(value)
  }

  return (
    <div className='mt-5 flex w-full flex-col p-2'>
      <div className='items center flex justify-center gap-5'>
        <div className='flex flex-col'>
          <SelectList
            setValue={setTitle}
            list={list}
            displayKey='voltage'
            dataKey='value'
            value={title}
            style='1stop-small'
          />
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            value={listType}
            setValue={(value) => setSortOrder(value)}
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
                <td className=''>{(value.capacity_kw / 1000).toFixed(3)}</td>
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

export default SolarList
