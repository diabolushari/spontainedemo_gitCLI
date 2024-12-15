import useFetchRecord from '@/hooks/useFetchRecord'
import { Model } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Paginator } from '@/ui/ui_interfaces'
import { Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

interface Properties {
  subset_id: string
  column1: string
  column2: string

  default_level?: string

  sortOrder?: string
  route: string
}

const listTypes: { name: string }[] = [{ name: '3' }, { name: '5' }, { name: '10' }, { name: '20' }]
const rangeList: { name: string; value: string }[] = [
  { name: 'All', value: 'total_arrears' },
  { name: '0-3', value: 'arrears__0_3_months_' },
  { name: '4-6', value: 'arrears__4_6_months_' },
  { name: '7-12', value: 'arrears__7_12_months_' },
  { name: '13-24', value: 'arrears__13_24_months_' },
  { name: '>24', value: 'arrears___24_months_' },
]
const levelTypes: { name: string; value: string }[] = [
  { name: 'Section', value: 'section' },
  { name: 'Region', value: 'region' },
  { name: 'Circle', value: 'circle' },
  { name: 'Subdivision', value: 'subdivision' },
  { name: 'Division', value: 'division' },
]

interface ConsumerList extends Model {
  office_code: string
  office_name: string
  arrears__0_3_months_?: number
  arrears__13_24_months_?: number
  arrears__4_6_months_?: number
  arrears__7_12_months_?: number
  arrears___24_months_?: number
  arrears_percentage__0_3_months_?: number
  arrears_percentage__13_24_months_?: number
  arrears_percentage__4_6_months_?: number
  arrears_percentage__7_12_months_?: number
  arrears_percentage___24_months_?: number
  total_arrears: number
}

const ArriersHTList = ({
  subset_id,
  column1,
  column2,
  default_level,

  sortOrder = 'desc',
  route,
}: Properties) => {
  const [page, setPage] = useState(1)
  const [selectedRange, setSelectedRange] = useState('total_arrears')
  const [headers, setHeaders] = useState([column1, column2])
  const [topOrBottom, setTopOrBottom] = useState(sortOrder)
  const [listType, setListType] = useState('10')
  const [officeLevel, setOfficeLevel] = useState(default_level ?? 'division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/${subset_id}?level=${officeLevel}&sort_by=${selectedRange}&sort_order=${topOrBottom}&limit=${listType}&page=${page}`
  )

  useEffect(() => {
    setHeaders([levelTypes.find((value) => value.value == officeLevel)?.name ?? column1, column2])
  }, [officeLevel, column1, column2])

  const isLoading = !graphValues || !graphValues.data

  const findValue = (value: ConsumerList) => {
    switch (selectedRange) {
      case 'arrears__0_3_months_':
        return value.arrears__0_3_months_
      case 'arrears__4_6_months_':
        return value.arrears__4_6_months_
      case 'arrears__7_12_months_':
        return value.arrears__7_12_months_
      case 'arrears__13_24_months_':
        return value.arrears__13_24_months_
      case 'arrears___24_months_':
        return value.arrears___24_months_
      default:
        return value.total_arrears
    }
  }

  return (
    <div className='flex w-full flex-col'>
      <div className='mt-4 flex w-full justify-end gap-2 p-2 pr-4'>
        <span className='subheader-sm-1stop'>Ranked by Arrear Counts</span>
      </div>
      <div className='items center flex justify-end gap-5 pr-4'>
        <div className='flex flex-col'>
          <SelectList
            list={rangeList}
            value={selectedRange}
            setValue={setSelectedRange}
            dataKey='value'
            displayKey='name'
            style='1stop-small'
          />
        </div>
        <div className='flex rounded-lg bg-1stop-white p-1'>
          <div
            className={`${topOrBottom == 'desc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
            onClick={() => {
              setTopOrBottom('desc')
            }}
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6.70898 2.3335H12.5423'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M4.08333 11.9583L1.75 9.625'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M4.08398 2.0415V11.9582'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 5.25H11.3757'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 8.1665H10.209'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 11.0835H9.04232'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div
            className={`${topOrBottom == 'asc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
            onClick={() => {
              setTopOrBottom('asc')
            }}
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6.70898 11.375H12.5423'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1.45898 9.33317L3.79232 11.6665'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M3.79102 11.6665V1.74984'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 8.4585H11.3757'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 5.5415H10.209'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6.70898 2.625H9.04232'
                stroke='#333333'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>

        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            value={listType}
            setValue={setListType}
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
      <table className='mx-4 mt-5'>
        <thead className='rounded-2xl text-left'>
          <tr className=''>
            {headers.map((header) => {
              return (
                <th
                  key={header}
                  className='small-1stop bg-1stop-white font-bold'
                >
                  {header}
                </th>
              )
            })}
          </tr>
        </thead>

        {isLoading ? (
          <Skeleton
            width={400}
            height={80}
          />
        ) : (
          <>
            <tbody>
              {graphValues?.data.data.map((value) => {
                return (
                  <tr
                    className='small-1stop text-left'
                    key={value.office_name}
                  >
                    <td className=''>{value.office_name}</td>
                    <td className=''>{findValue(value)}</td>
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
                  href={route}
                  className='small-1stop'
                >
                  <div className='rounded-md bg-1stop-highlight2 px-1 text-xl hover:opacity-70'>
                    <i className='las la-expand-arrows-alt'></i>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </table>
    </div>
  )
}

export default ArriersHTList
