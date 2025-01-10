import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Paginator } from '@/ui/ui_interfaces'
import SelectList from '@/ui/form/SelectList'
import Skeleton from 'react-loading-skeleton'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Link } from '@inertiajs/react'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'

interface Props {
  subsetId: number
  cardTitle: string
  dataField: string
  dataFieldName: string
  rankingPageUrl: string
  timePeriod: string
  timePeriodFieldName: string
  filterFieldName?: string
  filterListKey?: string
  filterListFetchURL?: string
  defaultFilterValue?: string
  onFilterChange?: (value: string) => void
  availableFields?: {
    subset_field_name: string
    subset_column: string
  }[]
}

const listTypes: { name: string }[] = [{ name: '3' }, { name: '5' }, { name: '10' }, { name: '20' }]
const levelTypes: { name: string; value: string }[] = [
  { name: 'Section', value: 'section' },
  { name: 'Subdivision', value: 'subdivision' },
  { name: 'Division', value: 'division' },
  { name: 'Circle', value: 'circle' },
  { name: 'Region', value: 'region' },
]

type SummaryItem = Record<string, number | string | null | undefined>

export default function DashboardRankedList({
  subsetId,
  dataField,
  cardTitle,
  dataFieldName,
  rankingPageUrl,
  timePeriod,
  timePeriodFieldName,
  defaultFilterValue,
  filterListFetchURL,
  filterListKey,
  filterFieldName,
  onFilterChange,
  availableFields,
}: Readonly<Props>) {
  const [pageNumber, setPageNumber] = useState(1)
  const [sortOrder, setSortOrder] = useState('desc')
  const [itemLimit, setItemLimit] = useState('10')
  const [officeLevel, setOfficeLevel] = useState('section')
  const [filterValue, setFilterValue] = useState<string>(defaultFilterValue ?? '')
  const [selectedColumn, setSelectedColumn] = useState(dataField)
  const [selectedFieldName, setSelectedFieldName] = useState(dataFieldName)

  useEffect(() => {
    if (onFilterChange == null) {
      return
    }
    onFilterChange(filterValue)
  }, [onFilterChange, filterValue])

  const fetchUrl = useMemo(() => {
    const params = {
      subsetDetail: subsetId,
      level: officeLevel,
      sort_by: selectedColumn,
      sort_order: sortOrder,
      limit: itemLimit,
      page: pageNumber,
      [timePeriodFieldName]: timePeriod,
    }

    if (filterFieldName != null) {
      params[filterFieldName] = filterValue
    }

    return route('subset.summary', {
      ...params,
    })
  }, [
    subsetId,
    officeLevel,
    selectedColumn,
    sortOrder,
    itemLimit,
    timePeriod,
    timePeriodFieldName,
    filterFieldName,
    filterValue,
    pageNumber,
  ])

  const [graphValues, isLoading] = useFetchRecord<{ data: Paginator<SummaryItem> }>(fetchUrl)

  const headers = useMemo(() => {
    const selectedLevel = levelTypes.find((value) => value.value == officeLevel)
    return [selectedLevel?.name ?? '', selectedFieldName]
  }, [officeLevel, selectedFieldName])

  const switchDisplayedColumn = useCallback(
    (column: string) => {
      const selectedField = availableFields?.find((value) => value.subset_column == column)

      if (selectedField == null) {
        return
      }

      setSelectedColumn(column)
      setSelectedFieldName(selectedField.subset_field_name)
    },
    [availableFields]
  )

  return (
    <div className='flex w-full flex-col'>
      <div className='mt-4 flex w-full justify-end gap-2 pb-2 pr-4 pt-4'>
        <span className='subheader-sm-1stop'>{cardTitle}</span>
      </div>
      <div className='flex items-center justify-end gap-5 pr-4'>
        {availableFields != null && (
          <div className='flex flex-col'>
            <SelectList
              list={availableFields}
              value={selectedColumn}
              setValue={switchDisplayedColumn}
              dataKey='subset_column'
              displayKey='subset_field_name'
              style='1stop-small'
            />
          </div>
        )}
        {filterListFetchURL != null && filterFieldName != null && filterListKey != null && (
          <FieldUniqueValueDropdown
            listFetchURL={filterListFetchURL}
            selectedValue={filterValue}
            setSelectedValue={setFilterValue}
            dataKey={filterListKey}
          />
        )}
        <div className='flex rounded-lg bg-1stop-white p-1'>
          <button
            className={`${sortOrder == 'desc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
            onClick={() => {
              setSortOrder('desc')
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
          </button>
          <button
            className={`${sortOrder == 'asc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
            onClick={() => {
              setSortOrder('asc')
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
          </button>
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            value={itemLimit}
            setValue={setItemLimit}
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
      {isLoading && (
        <Skeleton
          className='w-full p-4'
          height={79}
        />
      )}
      {!isLoading && (
        <>
          <table className='mx-4 mt-5'>
            <thead className='rounded-2xl text-left'>
              <tr className=''>
                {headers.map((header) => {
                  return (
                    <th
                      key={header}
                      className='subheader-sm-1stop bg-1stop-white'
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
                    className='data-xs-1stop text-start'
                    key={value.office_name}
                  >
                    <td className=''>{value.office_name}</td>
                    <td className='pl-2 text-start'>
                      {formatNumber((value[selectedColumn] ?? null) as number)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className='flex w-full items-center gap-6 px-4'>
            <div className='flex flex-grow flex-col'>
              {graphValues?.data != null && (
                <RestPagination
                  pagination={graphValues.data}
                  onNewPage={setPageNumber}
                />
              )}
            </div>
            <div className='flex flex-shrink-0 justify-end pt-4'>
              <Link
                href={rankingPageUrl}
                className='small-2stop'
              >
                <div className='bg-2stop-highlight2 rounded-md px-1 text-xl hover:opacity-70'>
                  <i className='las la-expand-arrows-alt'></i>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
