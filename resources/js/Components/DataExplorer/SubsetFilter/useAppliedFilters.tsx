import { useEffect, useState } from 'react'
import {
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import {
  dateOperations,
  dimensionOperations,
  measureOperations,
} from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'

export default function useAppliedFilters(
  dates: SubsetDateField[],
  dimensions: SubsetDimensionField[],
  measures: SubsetMeasureField[],
  filters: Record<string, string>
) {
  const [appliedFilters, setAppliedFilters] = useState<{ id: number; filter: string }[]>([])

  useEffect(() => {
    const newFilters: { id: number; filter: string }[] = []

    let uuidCounter = 1

    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        const filter = `${date.subset_column}${dateOperation.value == '=' ? '' : dateOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${date.subset_field_name} ${dateOperation.operation} ${filters[filter]}`,
          })
        }
      })
    })

    dimensions.forEach((dimension) => {
      dimensionOperations.forEach((dimensionOperation) => {
        const filter = `${dimension.subset_column}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${dimension.subset_field_name} ${dimensionOperation.operation} ${filters[filter]}`,
          })
        }
      })
    })

    measures.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        const filter = `${measure.subset_column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        if (filters[filter] != null) {
          newFilters.push({
            id: uuidCounter++,
            filter: `${measure.subset_field_name} ${measureOperation.operation} ${filters[filter]}`,
          })
        }
      })
    })

    setAppliedFilters(newFilters)
  }, [dates, dimensions, measures, filters])

  return { appliedFilters }
}
