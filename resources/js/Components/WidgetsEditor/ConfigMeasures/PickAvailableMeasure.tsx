import { Dimension } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import { useCallback, useMemo } from 'react'

interface PickAvailableMeasureProps {
  availableMeasures: Dimension[] | null
  usedColumns: string[]
  currentIndex: number
  selectedColumn: string
  onMeasureChange: (index: number, subset_column: string) => void
}

export default function PickAvailableMeasure({
  availableMeasures,
  usedColumns,
  currentIndex,
  selectedColumn,
  onMeasureChange,
}: Readonly<PickAvailableMeasureProps>) {
  const filteredMeasures = useMemo(() => {
    if (!availableMeasures) return []

    return availableMeasures.filter(
      (measure) =>
        !usedColumns.includes(measure.subset_column) || measure.subset_column === selectedColumn
    )
  }, [availableMeasures, usedColumns, selectedColumn])

  const handleChange = useCallback(
    (subset_column: string) => {
      onMeasureChange(currentIndex, subset_column)
    },
    [currentIndex, onMeasureChange]
  )

  return (
    <SelectList
      value={selectedColumn}
      setValue={handleChange}
      list={filteredMeasures}
      dataKey='subset_column'
      displayKey='subset_field_name'
      label='Select a measure'
      showLabel={false}
      style='normal'
    />
  )
}
