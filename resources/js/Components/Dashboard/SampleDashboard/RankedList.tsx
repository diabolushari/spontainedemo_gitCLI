import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import SelectList from '@/ui/form/SelectList'
import RestPagination from '@/ui/Pagination/RestPagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Paginator } from '@/ui/ui_interfaces'
import { Link } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import DynamicSelectList from '@/ui/form/DynamicSelectList'

interface Props {
  subsetId: number
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
  level?: string
  hierarchyId?: number
  dimension?: string
  fieldColumn?: string
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

export default function RankedList({
  subsetId,
  dataField,
  dataFieldName,
  rankingPageUrl,
  timePeriod,
  timePeriodFieldName,
  defaultFilterValue,
  filterListFetchURL,
  filterListKey,
  filterFieldName,
  onFilterChange,
  level = 'section',
  hierarchyId,
  dimension,
  fieldColumn,
}: Readonly<Props>) {
  const [pageNumber, setPageNumber] = useState(1)
  const [sortOrder, setSortOrder] = useState('desc')
  const [itemLimit, setItemLimit] = useState('10')
  const [officeLevel, setOfficeLevel] = useState(level)
  const [filterValue, setFilterValue] = useState<string>(defaultFilterValue ?? '')

  useEffect(() => {
    setOfficeLevel(level)
  }, [level])

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
      sort_by: dataField,
      sort_order: sortOrder,
      limit: itemLimit,
      page: pageNumber,
      [timePeriodFieldName]: timePeriod,
    }

    if (filterFieldName != null) {
      params[filterFieldName] = filterValue
    }

    if (dimension != null) {
      params['dimension'] = dimension
    }

    return route('subset.summary', {
      ...params,
    })
  }, [
    subsetId,
    officeLevel,
    dataField,
    sortOrder,
    itemLimit,
    timePeriod,
    timePeriodFieldName,
    filterFieldName,
    filterValue,
    pageNumber,
    dimension,
  ])
  const [graphValues, isLoading] = useFetchRecord<{ data: Paginator<SummaryItem> }>(fetchUrl)

  const headers = useMemo(() => {
    if (fieldColumn) {
      const dimensionDisplayName = fieldColumn
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return [dimensionDisplayName, dataFieldName]
    }

    const firstRow = graphValues?.data.data[0]
    if (!firstRow) {
      return ['', dataFieldName]
    }

    const columnNames = Object.keys(firstRow).filter(
      (key) => key !== dataField && key !== 'id' && key !== 'created_at' && key !== 'updated_at'
    )
    const dimensionColumn = columnNames[0] || ''
    const dimensionDisplayName = dimensionColumn
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return [dimensionDisplayName, dataFieldName]
  }, [graphValues?.data.data, dataFieldName, dataField, fieldColumn])

  return (
    <div className='relative flex w-full flex-col'>
      <div className='flex items-center justify-end gap-5 pr-4'>
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
            className={`${sortOrder === 'desc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
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
            className={`rotate-180 ${sortOrder === 'asc' ? 'bg-1stop-highlight2' : 'cursor-pointer hover:bg-1stop-accent2'} rounded-lg p-1`}
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
          <DynamicSelectList
            url={`/meta-hierarchy/${hierarchyId}/levels`}
            dataKey={'name'}
            displayKey={'name'}
            setValue={setOfficeLevel}
            value={officeLevel}
            style='1stop-small'
          />
        </div>
      </div>
      {isLoading && (
        <Skeleton
          className='w-full p-4'
          height={200}
        />
      )}
      {!isLoading && (
        <>
          <div className='mx-4 mt-5'>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((head) => (
                    <TableHead key={head}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {graphValues?.data.data.map((value, index) => {
                  // Extract all keys except the measure field
                  const columnNames = Object.keys(value).filter(
                    (key) =>
                      key !== dataField &&
                      key !== 'id' &&
                      key !== 'created_at' &&
                      key !== 'updated_at'
                  )

                  // Use the first available column (dimension/hierarchy column)
                  const dimensionKey = fieldColumn || columnNames[0] || 'office_name'
                  const displayValue =
                    typeof value[dimensionKey] === 'string' ? value[dimensionKey] : ''
                  const rowKey = displayValue !== '' ? displayValue : `row-${index}`
                  const columnValue = value[dataField] ?? null

                  return (
                    <TableRow key={rowKey}>
                      <TableCell>{displayValue}</TableCell>
                      <TableCell>{formatNumber(columnValue as number)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
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
              {(fieldColumn === 'office_code' || fieldColumn === 'office_name') && (
                <Link
                  href={rankingPageUrl}
                  className='small-2stop'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className='bg-2stop-highlight2 rounded-md px-1 text-xl hover:opacity-70'>
                    <i className='las la-expand-arrows-alt'></i>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
