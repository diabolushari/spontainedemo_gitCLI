import React from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

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
}

interface OverviewGridProps {
  config: Config
  toggleValue: boolean
  selected: string
  onSelect: (value: string) => void
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  toggleValue,
  selected,
  onSelect,
  selectedMonth,
  setSelectedMonth,
}) => {
  const {
    dimension_field,
    subset_id,
    grid_number,
    measure_field,
    title,
    show_total,
    measure_field_dimension,
  } = config

  // API URL to fetch dimension values
  const dimensionApiUrl = `/api/subset/dimension/fields/${dimension_field}/${subset_id}`
  const [dimensionResponse, dimensionLoading] = useFetchRecord<{ name: string }[]>(dimensionApiUrl)
  const dimensionValues = dimensionResponse ? dimensionResponse.map((d) => d.name) : []
  const [graphValues] = useFetchRecord(
    `/subset/${subset_id}?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}&${measure_field_dimension ? `${dimension_field}=${measure_field_dimension}` : ''}`
  )
  const isMultiMeasure = measure_field?.length > 0
  console.log(subset_id, graphValues, measure_field_dimension)
  const gridNumber = parseInt(grid_number || '', 10)
  const visibleCount =
    isNaN(gridNumber) || gridNumber <= 0
      ? isMultiMeasure
        ? measure_field.length
        : dimensionValues.length
      : gridNumber

  return (
    <div className='flex w-full flex-col gap-4 p-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      {dimensionLoading ? (
        <Skeleton height={200} />
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {/* Total card on top */}
          {show_total && (
            <div className='col-span-2 rounded border bg-gray-100 p-4 text-center font-semibold text-gray-800'>
              TOTAL
            </div>
          )}

          {/* Dynamic logic: measure-field or dimension-based cards */}
          {measure_field_dimension
            ? measure_field.slice(0, visibleCount).map((field) => (
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
            : dimensionValues.slice(0, visibleCount).map((value) => (
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
                    {graphValues?.data?.[0]?.[dimension_field] === value ? (
                      <span className='text-green-500'>
                        {formatNumber(graphValues?.data?.[0]?.[measure_field[0].value])}
                      </span>
                    ) : (
                      <span className='text-red-500'>✗</span>
                    )}
                  </p>
                </div>
              ))}
        </div>
      )}
    </div>
  )
}
export default OverviewGrid
