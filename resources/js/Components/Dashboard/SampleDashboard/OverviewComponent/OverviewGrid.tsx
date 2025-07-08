import React, { useMemo } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

import type { OverviewTable, Filter } from '@/interfaces/data_interfaces'

interface OverviewGridProps {
  readonly config: OverviewTable
  readonly selected: string | null
  readonly onSelect: (value: string) => void
  readonly selectedMonth: Date | null
  readonly onDelete?: (id: number) => void
}

const getMonthYear = (selectedMonth: Date | null): string => {
  return dateToYearMonth(selectedMonth)
}

const getFilterQuery = (filters?: Filter[]): string => {
  if (!filters || filters.length === 0) return ''
  const params = new URLSearchParams()
  filters.forEach((filter: Filter) => {
    params.append(filter.dimension, String(filter.value))
  })
  return `&${params.toString()}`
}

const getCellData = (
  graphValues: any,
  title: string,
  measureField: string 
): { title: string; value: string } => {
  if (!graphValues?.data || !Array.isArray(graphValues.data) || graphValues.data.length === 0 || !measureField) {
    return { title, value: 'N/A' }
  }
  
  const dataKey = measureField;
  
  const totalValue = graphValues.data.reduce((sum: number, item: any) => {
    if (item && typeof item[dataKey] === 'number') {
      return sum + item[dataKey]
    }
    return sum
  }, 0)
  
  return { title, value: formatNumber(totalValue) }
}


const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  selected,
  onSelect,
  selectedMonth,
  onDelete
}) => {
  const { subset_id, measure_field, title, filters, id } = config

  const monthYear = useMemo(() => getMonthYear(selectedMonth), [selectedMonth])
  const filterQuery = useMemo(() => getFilterQuery(filters), [filters])

  const [graphValues, loading] = useFetchRecord(
    `/subset/${subset_id ?? ''}?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}${filterQuery}`
  )
    
  const cellData = useMemo(() => getCellData(graphValues, title, measure_field), [graphValues, title, measure_field])

  if (loading) {
    return (
      <div className='rounded-lg border bg-white p-4 shadow'>
        <Skeleton height={60} />
      </div>
    )
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => {
        onDelete?.(id) 
      }}
      className={`relative cursor-pointer rounded-lg border bg-white p-4 text-center shadow outline-none transition hover:shadow-lg`}
    >
      <p className='text-sm uppercase text-gray-600'>{cellData.title}</p>
      <p className='text-xl font-bold'>{cellData.value}</p>
    </div>
  )
}

export default OverviewGrid