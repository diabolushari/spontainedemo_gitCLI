import { useEffect, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Dimension } from '@/interfaces/data_interfaces'
import { Plus, X } from 'lucide-react'

interface MeasureFieldSelectorProps {
  subsetId: number
  measures?: SelectedMeasure[]
  onMeasuresChange?: (measures: SelectedMeasure[]) => void
  allowMultiple?: boolean
  showUnit?: boolean
}

interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit?: string
}

export default function MeasureFieldSelector({
  subsetId,
  measures,
  onMeasuresChange,
  allowMultiple = true,
  showUnit = false,
}: MeasureFieldSelectorProps) {
  const [availableMeasures] = useFetchRecord<Dimension[]>(
    subsetId ? `/api/subset/${subsetId}` : null
  )

  const [selectedMeasures, setSelectedMeasures] = useState<SelectedMeasure[]>([
    { subset_column: '', subset_field_name: '', unit: '' },
  ])

  // Initialize from measures prop when component mounts or measures/subsetId changes
  useEffect(() => {
    if (measures && Array.isArray(measures) && measures.length > 0) {
      // Filter out any empty measures
      const validMeasures = measures.filter(
        (m: SelectedMeasure) => m.subset_column && m.subset_field_name
      )

      if (validMeasures.length > 0) {
        setSelectedMeasures(validMeasures)
      } else {
        setSelectedMeasures([{ subset_column: '', subset_field_name: '', unit: '' }])
      }
    } else {
      setSelectedMeasures([{ subset_column: '', subset_field_name: '', unit: '' }])
    }
  }, [subsetId, measures])

  // Get already selected measure columns
  const selectedColumns = selectedMeasures.map((m) => m.subset_column).filter((col) => col !== '')

  // Filter out already selected measures
  const getAvailableMeasures = (currentIndex: number) => {
    const currentSelection = selectedMeasures[currentIndex]?.subset_column
    return availableMeasures?.filter(
      (measure) =>
        !selectedColumns.includes(measure.subset_column) ||
        measure.subset_column === currentSelection
    )
  }

  const handleMeasureChange = (index: number, subset_column: string) => {
    const selectedMeasure = availableMeasures?.find((m) => m.subset_column === subset_column)

    const updatedMeasures = selectedMeasures.map((measure, i) =>
      i === index && selectedMeasure
        ? {
            subset_column: selectedMeasure.subset_column,
            subset_field_name: selectedMeasure.subset_field_name,
            unit: measure.unit || '',
          }
        : measure
    )

    setSelectedMeasures(updatedMeasures)
    onMeasuresChange?.(updatedMeasures)
  }

  const handleFieldNameChange = (index: number, subset_field_name: string) => {
    const updatedMeasures = selectedMeasures.map((measure, i) =>
      i === index
        ? {
            ...measure,
            subset_field_name: subset_field_name,
          }
        : measure
    )

    setSelectedMeasures(updatedMeasures)
    onMeasuresChange?.(updatedMeasures)
  }

  const handleUnitChange = (index: number, unit: string) => {
    const updatedMeasures = selectedMeasures.map((measure, i) =>
      i === index
        ? {
            ...measure,
            unit: unit,
          }
        : measure
    )

    setSelectedMeasures(updatedMeasures)
    onMeasuresChange?.(updatedMeasures)
  }

  const handleAddMeasure = () => {
    const newMeasures = [
      ...selectedMeasures,
      { subset_column: '', subset_field_name: '', unit: '' },
    ]
    setSelectedMeasures(newMeasures)
    onMeasuresChange?.(newMeasures)
  }

  const handleRemoveMeasure = (index: number) => {
    if (selectedMeasures.length > 1) {
      const updatedMeasures = selectedMeasures.filter((_, i) => i !== index)
      setSelectedMeasures(updatedMeasures)
      onMeasuresChange?.(updatedMeasures)
    }
  }

  return (
    <>
      <label className='standard-label small-1stop text-sm font-normal text-slate-700'>
        {allowMultiple ? 'Measures' : 'Measure'}
      </label>

      {/* Measure Selectors */}
      <div className='space-y-3'>
        {selectedMeasures.map((selectedMeasure, index) => (
          <div
            key={index}
            className='space-y-2'
          >
            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <select
                  value={selectedMeasure.subset_column}
                  onChange={(e) => handleMeasureChange(index, e.target.value)}
                  className='w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                >
                  <option value=''>Select a measure</option>
                  {getAvailableMeasures(index)?.map((measure) => (
                    <option
                      key={measure.subset_column}
                      value={measure.subset_column}
                    >
                      {measure.subset_field_name}
                    </option>
                  ))}
                </select>
                {/* Dropdown arrow */}
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    className='h-5 w-5 text-slate-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>

              {/* Remove button - show only if multiple measures allowed and more than one exists */}
              {allowMultiple && selectedMeasures.length > 1 && (
                <button
                  type='button'
                  onClick={() => handleRemoveMeasure(index)}
                  className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                  aria-label='Remove measure'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>

            {/* Editable field name and unit inputs - only show if a measure is selected */}
            {selectedMeasure.subset_column && (
              <>
                {showUnit ? (
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={selectedMeasure.subset_field_name}
                      onChange={(e) => handleFieldNameChange(index, e.target.value)}
                      placeholder='Custom label (optional)'
                      className='flex-1 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                    />
                    <input
                      type='text'
                      value={selectedMeasure.unit || ''}
                      onChange={(e) => handleUnitChange(index, e.target.value)}
                      placeholder='Unit'
                      className='w-24 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                    />
                  </div>
                ) : (
                  <input
                    type='text'
                    value={selectedMeasure.subset_field_name}
                    onChange={(e) => handleFieldNameChange(index, e.target.value)}
                    placeholder='Custom label (optional)'
                    className='w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                  />
                )}
              </>
            )}
          </div>
        ))}

        {/* Plus button - show only if multiple measures allowed and there are available measures */}
        {allowMultiple && selectedColumns.length < (availableMeasures?.length || 0) && (
          <button
            type='button'
            onClick={handleAddMeasure}
            className='flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200'
          >
            <Plus className='h-4 w-4' />
            <span>Add Measure</span>
          </button>
        )}
      </div>
    </>
  )
}
