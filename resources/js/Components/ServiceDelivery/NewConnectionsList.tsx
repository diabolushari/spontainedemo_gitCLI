import useFetchRecord from '@/hooks/useFetchRecord'
import { Model } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Paginator } from '@/ui/ui_interfaces'
import { Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import Skeleton from 'react-loading-skeleton'

interface Properties {
  subset_id: string
  column1: string
  column2: string
  displayKey?: string
  default_level?: string
  sortBy?: string
  sortOrder?: string
  route: string
}

const listTypes: { name: string }[] = [{ name: '3' }, { name: '5' }, { name: '10' }, { name: '20' }]
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
  complaint_count?: number
  consumer_count?: number
  sla_perf_cnt?: number
  requests_within_sla__count_?: string
  pend_beyond_sla__?: number
  sla_perf__?: number
}

const NewConnectionsList = ({
  subset_id,
  column1,
  column2,
  displayKey,
  default_level,
  sortBy = 'consumer_count',
  sortOrder = 'desc',
  route,
}: Properties) => {
  const [toggleValue, settoggleValue] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState([column1, column2])
  const [topOrBottom, setTopOrBottom] = useState(sortOrder)
  const [listType, setListType] = useState('10')
  const [officeLevel, setOfficeLevel] = useState(default_level ?? 'division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/${subset_id}?level=${officeLevel}&sort_by=${
      toggleValue ? 'sla_perf_cnt' : 'sla_perf__'
    }&sort_order=${topOrBottom}&limit=${listType}&page=${page}`
  )

  useEffect(() => {
    setHeaders([
      levelTypes.find((value) => value.value == officeLevel)?.name ?? column1,
      toggleValue ? 'Overall SLA Compliant Requests (count)' : 'Overall SLA Compliant Requests (%)',
    ])
  }, [officeLevel, column1, column2, toggleValue])
  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const isLoading = !graphValues || !graphValues.data

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full justify-end pt-2'>
        <button
          className='small-1stop cursor-pointer'
          onClick={handleToogleNumber}
        >
          {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
        </button>
      </div>
      <div className='flex w-full justify-end gap-2 pb-2 pr-4'>
        <span className='subheader-sm-1stop'>
          {toggleValue
            ? 'Ranked by Overall SLA Compliant Requests (count)'
            : 'Ranked by Overall SLA Compliant Requests (%)'}
        </span>
      </div>
      <div className='flex w-full items-center justify-end gap-5 pr-4'>
        <div className='flex rounded-lg bg-1stop-white p-1'>
          <div
            className={`${topOrBottom == 'desc' ? 'bg-1stop-highlight2' : ''} rounded-lg p-1`}
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
            className={`${topOrBottom == 'asc' ? 'bg-1stop-highlight2' : ''} rounded-lg p-1`}
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
          <tbody>
            {graphValues?.data.data.map((value) => {
              return (
                <tr
                  className='small-1stop text-start'
                  key={value.office_name}
                >
                  <td className=''>{value.office_name}</td>
                  <td className='pl-2 text-start'>
                    {toggleValue ? value.sla_perf_cnt : value.pend_beyond_sla__?.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
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

export default NewConnectionsList
