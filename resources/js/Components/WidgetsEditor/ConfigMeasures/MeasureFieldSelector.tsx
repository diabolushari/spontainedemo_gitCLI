import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Dimension } from '@/interfaces/data_interfaces'
import { Plus, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PickAvailableMeasure from './PickAvailableMeasure'

interface MeasureFieldSelectorProps {
  subsetId: string | null
  measures?: SelectedMeasure[] | null
  onMeasuresChange?: (measures: SelectedMeasure[]) => void
  allowMultiple?: boolean
  showUnit?: boolean
}

function initSelectedMeasures(measures?: SelectedMeasure[] | null): SelectedMeasure[] {
  if (measures != null && measures.length > 0) {
    const validMeasures = measures.filter(
      (m: SelectedMeasure) => m.subset_column && m.subset_field_name
    )

    if (validMeasures.length > 0) {
      return validMeasures
    }
  }

  return []
}

export default function MeasureFieldSelector({
  subsetId,
  measures,
  onMeasuresChange,
  allowMultiple = true,
  showUnit = false,
}: Readonly<MeasureFieldSelectorProps>) {
  const [availableMeasures] = useFetchRecord<Dimension[]>(
    subsetId ? `/api/subset/${subsetId}` : null
  )

  const [selectedMeasures, setSelectedMeasures] = useState<SelectedMeasure[]>(() =>
    initSelectedMeasures(measures)
  )

  const prevSubsetIdRef = useRef(subsetId)

  // Only reset when subsetId changes
  useEffect(() => {
    if (prevSubsetIdRef.current !== subsetId) {
      prevSubsetIdRef.current = subsetId
      setSelectedMeasures(initSelectedMeasures(measures))
    }
  }, [subsetId, measures])

  // Get already selected measure columns
  const usedColumns = selectedMeasures.map((m) => m.subset_column).filter((col) => col !== '')

  const handleMeasureChange = useCallback(
    (index: number, subsetColumn: string) => {
      const selectedMeasure = availableMeasures?.find((m) => m.subset_column === subsetColumn)
      const updatedMeasures = selectedMeasures.map((measure, i) => {
        if (i === index && selectedMeasure != null) {
          return {
            subset_column: selectedMeasure.subset_column,
            subset_field_name: selectedMeasure.subset_field_name,
            unit: measure.unit || '',
          }
        }
        return measure
      })
      setSelectedMeasures(updatedMeasures)
      onMeasuresChange?.(updatedMeasures)
    },
    [availableMeasures, selectedMeasures, onMeasuresChange]
  )

  const handleFieldNameChange = (index: number, subsetFieldName: string) => {
    const updatedMeasures = selectedMeasures.map((measure, i) => {
      if (i === index) {
        return {
          ...measure,
          subset_field_name: subsetFieldName,
        }
      }
      return measure
    })

    setSelectedMeasures(updatedMeasures)
    onMeasuresChange?.(updatedMeasures)
  }

  const handleUnitChange = (index: number, unit: string) => {
    const updatedMeasures = selectedMeasures.map((measure, i) => {
      if (i === index) {
        return {
          ...measure,
          unit,
        }
      }
      return measure
    })

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
    const updatedMeasures = selectedMeasures.filter((_, i) => i !== index)
    setSelectedMeasures(updatedMeasures)
    onMeasuresChange?.(updatedMeasures)
  }

  const showAddMeasureButton = useMemo(() => {
    if (!allowMultiple && selectedMeasures.length === 1) {
      return false
    }
    return availableMeasures?.length !== selectedMeasures.length
  }, [allowMultiple, availableMeasures, selectedMeasures.length])

  return (
    <>
      <label className='standard-label small-1stop text-sm font-normal text-slate-700'>
        {allowMultiple ? 'Measures' : 'Measure'}
      </label>

      {/* Measure Selectors */}
      <div className='space-y-4'>
        {selectedMeasures.map((selectedMeasure, index) => (
          <div
            key={selectedMeasure.subset_column + index}
            className='space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:border-slate-300'
          >
            {allowMultiple && (
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-medium text-slate-500'>Measure {index + 1}</span>
                <button
                  type='button'
                  onClick={() => handleRemoveMeasure(index)}
                  className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                  aria-label='Remove measure'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <PickAvailableMeasure
                availableMeasures={availableMeasures}
                usedColumns={usedColumns}
                currentIndex={index}
                selectedColumn={selectedMeasure.subset_column}
                onMeasureChange={handleMeasureChange}
              />
            </div>

            {/* Editable field name and unit inputs - only show if a measure is selected */}
            {selectedMeasure.subset_column && (
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={selectedMeasure.subset_field_name}
                  onChange={(e) => handleFieldNameChange(index, e.target.value)}
                  placeholder='Custom label (optional)'
                  className='flex-1 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                />
                {showUnit && (
                  <input
                    type='text'
                    value={selectedMeasure.unit ?? ''}
                    onChange={(e) => handleUnitChange(index, e.target.value)}
                    placeholder='Unit'
                    className='w-24 appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {showAddMeasureButton && (
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
