import React, { useMemo } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

// Interface definitions (no changes here)
interface MeasureField {
  label: string
  value: string
  unit: string
  show_label: boolean
}

interface Config {
  title: string
  subset_id: string
  dimension_field: string
  grid_number: string
  measure_field: MeasureField[]
  show_total: boolean
  measure_field_dimension: string
  order?: 'ascending' | 'descending'
}

// 1. UPDATE PROPS: Add the optional 'onAdd' handler
interface OverviewGridProps {
  config: Config
  selected: string
  onSelect: (value: string) => void
  selectedMonth: Date | null
  onAdd?: () => void // <-- ADD THIS LINE
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  selected,
  onSelect,
  selectedMonth,
  onAdd, // <-- 2. Destructure the new prop
}) => {
  const {
    dimension_field,
    subset_id,
    grid_number,
    measure_field,
    title,
    show_total,
    measure_field_dimension,
    order,
  } = config

  // ... (all existing hooks and memoized calculations remain the same)
  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])

  const dimensionApiUrl = `/api/subset/dimension/fields/${dimension_field}/${subset_id}`
  const [dimensionResponse, dimensionLoading] = useFetchRecord<{ name: string }[]>(dimensionApiUrl)
  const dimensionValues = dimensionResponse ? dimensionResponse.map((d) => d.name) : []

  const [graphValues] = useFetchRecord(
    `/subset/${subset_id}?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}${
      measure_field_dimension ? `&${dimension_field}=${measure_field_dimension}` : ''
    }`
  )

  const sortedMeasureFields = useMemo(() => {
    const data = graphValues?.data?.[0]
    const fieldsToSort = [...measure_field]
    if (!order || !data) return fieldsToSort
    fieldsToSort.sort((a, b) => {
      const valA = data[a.value]
      const valB = data[b.value]
      const numA = typeof valA === 'number' ? valA : -Infinity
      const numB = typeof valB === 'number' ? valB : -Infinity
      return order === 'descending' ? numB - numA : numA - numB
    })
    return fieldsToSort
  }, [measure_field, graphValues, order])

  const dataMap = useMemo(() => {
    if (!graphValues?.data || !measure_field?.[0]?.value) {
      return new Map<string, number>()
    }
    const measureKey = measure_field[0].value
    const map = new Map<string, number>()
    graphValues.data.forEach((item: any) => {
      if (item[dimension_field] !== undefined) {
        map.set(item[dimension_field], item[measureKey])
      }
    })
    return map
  }, [graphValues, dimension_field, measure_field])

  const sortedDimensionValues = useMemo(() => {
    const valuesToSort = [...dimensionValues]
    if (!order) return valuesToSort
    valuesToSort.sort((a, b) => {
      const valA = dataMap.get(a) ?? -Infinity
      const valB = dataMap.get(b) ?? -Infinity
      return order === 'descending' ? valB - valA : valA - valB
    })
    return valuesToSort
  }, [dimensionValues, dataMap, order])

  const totalValue = useMemo(() => {
    if (
      !show_total ||
      measure_field_dimension ||
      !graphValues?.data ||
      measure_field.length === 0
    ) {
      return null
    }
    const measureKey = measure_field[0].value
    return graphValues.data.reduce((sum: number, item: any) => {
      const value = item[measureKey]
      return typeof value === 'number' ? sum + value : sum
    }, 0)
  }, [show_total, measure_field_dimension, graphValues, measure_field])

  const gridNumber = parseInt(grid_number || '', 10)
  const totalItems = measure_field_dimension
    ? sortedMeasureFields.length
    : sortedDimensionValues.length

  const visibleCount = gridNumber > 0 ? gridNumber : totalItems

  return (
    <div className='flex w-full flex-col gap-4 p-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      {dimensionLoading ? (
        <Skeleton height={200} />
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {show_total && totalValue !== null && (
            <div className='col-span-2 rounded border bg-gray-100 p-4 text-center'>
              <p className='text-sm uppercase text-gray-600'>Total</p>
              <p className='text-xl font-bold'>{formatNumber(totalValue)}</p>
            </div>
          )}

          {/* Data mapping logic remains the same */}
          {measure_field_dimension
            ? sortedMeasureFields.slice(0, visibleCount).map((field) => (
                <div
                  key={field.value}
                  role='button'
                  tabIndex={0}
                  onClick={() => onSelect(field.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(field.value)
                    }
                  }}
                  className={`cursor-pointer rounded border p-4 text-center outline-none transition ${
                    selected === field.value ? 'border-blue-500 bg-blue-100' : 'hover:shadow'
                  }`}
                >
                  <p className='text-sm text-gray-600'>{field.label}</p>
                  <p>{formatNumber(graphValues?.data?.[0]?.[field.value] ?? 'N/A')}</p>
                </div>
              ))
            : sortedDimensionValues.slice(0, visibleCount).map((value) => (
                <div
                  key={value}
                  role='button'
                  tabIndex={0}
                  onClick={() => onSelect(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(value)
                    }
                  }}
                  className={`cursor-pointer rounded border p-4 text-center outline-none transition ${
                    selected === value ? 'border-blue-500 bg-blue-100' : 'hover:shadow'
                  }`}
                >
                  <p className='text-lg font-bold'>{value}</p>
                  <p>
                    {dataMap.has(value) ? (
                      <span className='text-green-500'>{formatNumber(dataMap.get(value))}</span>
                    ) : (
                      <span className='text-red-500'>✗</span>
                    )}
                  </p>
                </div>
              ))}

          {/* 3. & 4. CONDITIONALLY RENDER THE "ADD" BUTTON */}
          {onAdd && (
            <button
              type='button'
              onClick={onAdd}
              className='flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 p-4 text-center text-gray-400 outline-none transition hover:border-gray-400 hover:bg-gray-50 focus-visible:border-blue-500 focus-visible:bg-blue-50'
              aria-label='Add new item'
            >
              <span className='text-4xl font-light leading-none'>+</span>
              <span className='mt-1 text-xs font-semibold'>ADD NEW</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
export default OverviewGrid
