import React, { useState, useEffect } from 'react'
import SelectList from '@/ui/form/SelectList'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { X } from 'lucide-react'

interface Props {
  url: string
  dataKey: string
  displayKey: string
  onChange: (filters: Array<{ dimension: string; operator: string; value: string }>) => void
  label?: string
  subsetId: string
  errorBag?: Record<string, string>
}

// Fixed value options (always shown in every filter)
const operatorOptions = [
  { label: 'Greater than', value: 'greater_than' },
  { label: 'Less than', value: 'less_than' },
  { label: 'Equal to', value: 'equal_to' },
  { label: 'Not equal to', value: 'not_equal_to' },
  { label: 'Greater than or equal to', value: 'greater_than_or_equal_to' },
  { label: 'Less than or equal to', value: 'less_than_or_equal_to' },
]

export default function MultiDynamicSelector({
  url,
  dataKey,
  displayKey,
  onChange,
  label,
  subsetId,
  errorBag,
}: Props) {
  const [records, setRecords] = useState<any[]>([])
  const [filters, setFilters] = useState<
    Array<{ dimension: string | ''; value: string; operator: string }>
  >([])
  const getFieldError = (index: number, field: 'dimension' | 'operator' | 'value') => {
    const key = `overview_table.filters.${index}.${field}`
    return errorBag?.[key] || ''
  }
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(() => setRecords([]))
  }, [url])

  const handleAdd = () => {
    setFilters((prev) => [...prev, { dimension: '', value: '', operator: '' }])
  }

  const handleRemove = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'dimension' | 'value' | 'operator', value: any) => {
    setFilters((prev) => {
      const newFilters = [...prev]
      newFilters[index] = { ...newFilters[index], [field]: value }
      return newFilters
    })
  }

  const hasIncompleteFilter = filters.some((f) => !f.dimension || !f.value || !f.operator)

  // Return available dimensions, excluding already-selected ones in other rows
  const getAvailableDimensions = (currentIndex: number) => {
    const selectedDimensions = filters
      .map((f, i) => (i !== currentIndex ? f.dimension : null))
      .filter((d): d is string => d !== null && d !== '')

    return records.filter((record) => !selectedDimensions.includes(record[dataKey]))
  }
  useEffect(() => {
    onChange(filters)
  }, [filters])
  const isAddDisabled = hasIncompleteFilter || filters.length >= records.length
  console.log('chagning', errorBag)
  return (
    <div className='flex flex-col gap-4'>
      <label className='font-medium text-gray-700'>{label ?? 'Select Multiple Filters'}</label>

      {filters.map((filter, index) => {
        const availableDimensions = getAvailableDimensions(index)

        return (
          <div
            key={index}
            className='flex items-center gap-4 rounded border p-3 md:grid md:grid-cols-3'
          >
            {/* Dimension Select */}
            <div className='flex flex-col'>
              <SelectList
                list={availableDimensions}
                dataKey={dataKey}
                displayKey={displayKey}
                setValue={(val) => handleChange(index, 'dimension', val)}
                label='Dimension'
                value={filter.dimension || ''}
                disabled={false}
                showAllOption={false}
                error={getFieldError(index, 'dimension')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                list={operatorOptions}
                dataKey='value'
                displayKey='label'
                setValue={(val) => handleChange(index, 'operator', val)}
                label='Operator'
                value={filter.operator}
                disabled={false}
                showAllOption={false}
                error={getFieldError(index, 'operator')}
              />
            </div>
            <div className='flex flex-col'>
              {filter.dimension && subsetId && (
                <DynamicSelectList
                  url={`/api/subset/dimension/fields/${filter.dimension}/${subsetId}`}
                  dataKey='name'
                  displayKey='name'
                  setValue={(val) => handleChange(index, 'value', val)}
                  label='Metric'
                  value={filter.value}
                  disabled={false}
                  showAllOption={false}
                  error={getFieldError(index, 'value')}
                />
              )}
            </div>

            {/* Value Select — always shows all options */}

            <div className='col-span-3 flex justify-end'>
              <div>
                <Button
                  type='button'
                  label=''
                  icon={<X />}
                  onClick={() => handleRemove(index)}
                />
              </div>
            </div>
          </div>
        )
      })}

      {/* Add Filter Button */}
      <Button
        type='button'
        label='Add Filter'
        onClick={handleAdd}
        disabled={isAddDisabled}
      />
    </div>
  )
}
