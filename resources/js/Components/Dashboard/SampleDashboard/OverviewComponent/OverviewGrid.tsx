import React from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'

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
  data: Record<string, any>[]
  toggleValue: boolean
  selected: string
  onSelect: (value: string) => void
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  data,
  toggleValue,
  selected,
  onSelect,
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
  const apiUrl = `/api/subset/dimension/fields/${dimension_field}/${subset_id}`
  const [response, loading] = useFetchRecord<{ name: string }[]>(apiUrl)
  const dimensionValues = response ? response.map((d) => d.name) : []

  const isMultiMeasure = measure_field?.length > 1 && measure_field_dimension

  // grid limit logic
  const gridNumber = parseInt(grid_number || '', 10)
  const visibleCount =
    isNaN(gridNumber) || gridNumber <= 0
      ? isMultiMeasure
        ? measure_field.length
        : dimensionValues.length
      : gridNumber

  const getMetricValue = (fieldValue: string, metricKey: string) => {
    const total = data.reduce((sum, item) => sum + (item[metricKey] || 0), 0)
    const current = data
      .filter((item) => item[dimension_field] === fieldValue)
      .reduce((sum, item) => sum + (item[metricKey] || 0), 0)

    if (toggleValue) {
      return current.toLocaleString()
    } else {
      const percent = total ? (current / total) * 100 : 0
      return `${percent.toFixed(2)}%`
    }
  }

  return (
    <div className='flex w-full flex-col gap-4 p-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      {loading ? (
        <div className='text-sm text-gray-500'>Loading...</div>
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {/* Total card on top */}
          {show_total && (
            <div className='col-span-2 rounded border bg-gray-100 p-4 text-center font-semibold text-gray-800'>
              TOTAL
            </div>
          )}

          {/* Dynamic logic: measure-field or dimension-based cards */}
          {isMultiMeasure
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
                  <p className='text-lg font-bold'>
                    {getMetricValue(measure_field_dimension, field.value)}
                  </p>
                  {field.show_label && <p className='text-sm text-gray-600'>{field.label}</p>}
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
                  <p className='text-lg font-bold'>
                    {getMetricValue(value, measure_field[0]?.value || '')}
                  </p>
                  {measure_field[0]?.show_label && <p className='text-sm text-gray-600'>{value}</p>}
                </div>
              ))}
        </div>
      )}
    </div>
  )
}
export default OverviewGrid
