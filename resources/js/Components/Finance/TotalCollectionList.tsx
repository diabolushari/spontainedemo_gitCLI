import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Model } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Paginator } from '@/ui/ui_interfaces'
import { Link } from '@inertiajs/react'
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
  total_collection: number
}
const TotalCollectionList = ({
  subset_id,
  column1,
  column2,

  default_level,
  sortBy = 'total_collection',
  sortOrder = 'desc',
}: Properties) => {
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState([column1, column2])
  const [topOrBottom, setTopOrBottom] = useState(sortOrder)
  const [listType, setListType] = useState('Top 10')
  const [officeLevel, setOfficeLevel] = useState(default_level ?? 'division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/${subset_id}?level=${officeLevel}&sort_by=${sortBy}&sort_order=${topOrBottom}&limit=${listType.split(' ')[1]}&page=${page}`
  )

  useEffect(() => {
    setHeaders([levelTypes.find((value) => value.value == officeLevel)?.name ?? column1, column2])
  }, [officeLevel, column1, column2])

  //set top or bottom
  const setSortOrder = (value: string) => {
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
                <td className=''>{formatNumber(value.total_collection)}</td>
              </tr>
            )
          })}
        </tbody>
        <div className='flex w-full items-center gap-5'>
          <div className='flex min-w-full flex-col'>
            {graphValues?.data != null && (
              <RestPagination
                pagination={graphValues.data}
                onNewPage={setPage}
              />
            )}
          </div>
          <div className='ml-auto flex w-full justify-end pt-3'>
            <Link
              href={`office-rankings/Collection Summary?route=${route('finance.index')}`}
              className='link small-1stop'
            >
              Details
            </Link>
          </div>
        </div>
      </table>
    </div>
  )
}

export default TotalCollectionList
