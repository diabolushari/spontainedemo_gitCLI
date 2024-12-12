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
} from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import { dateToYearMonth } from '@/Components/ServiceDelivery/ActiveConnection'

export interface AppliedSubsetFilter {
  id: number
  filter: string
  filterKey: string
  filterValue: string
}

export default function useAppliedFilters(
  filters: Record<string, string>,
  selectedMonth: Date | null,
  dates?: SubsetDateField[],
  dimensions?: SubsetDimensionField[],
  measures?: SubsetMeasureField[]
) {
  const [appliedFilters, setAppliedFilters] = useState<AppliedSubsetFilter[]>([])

  useEffect(() => {
    const allFilters: Record<string, string | undefined | null> = {
      ...filters,
      month: dateToYearMonth(selectedMonth),
    }

    const newFilters: AppliedSubsetFilter[] = []

    let uuidCounter = 1

    dates?.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        const filter = `${date.subset_column}${dateOperation.value == '=' ? '' : dateOperation.value}`
        if (allFilters[filter] != null && allFilters[filter] !== '') {
          newFilters.push({
            id: uuidCounter++,
            filter: `${date.subset_field_name} ${dateOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: allFilters[filter],
          })
        }
      })
    })

    dimensions?.forEach((dimension) => {
      dimensionOperations.forEach((dimensionOperation) => {
        const filter = `${dimension.subset_column}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        if (allFilters[filter] != null && allFilters[filter] !== '') {
          newFilters.push({
            id: uuidCounter++,
            filter: `${dimension.subset_field_name} ${dimensionOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: allFilters[filter],
          })
        }
      })
    })

    measures?.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        const filter = `${measure.subset_column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        if (allFilters[filter] != null && allFilters[filter] !== '') {
          newFilters.push({
            id: uuidCounter++,
            filter: `${measure.subset_field_name} ${measureOperation.operation} ${filters[filter]}`,
            filterKey: filter,
            filterValue: allFilters[filter],
          })
        }
      })
    })

    if (filters['office_code'] != null) {
      newFilters.push({
        id: uuidCounter++,
        filter: `Office Code ${filters['office_code']}`,
        filterKey: 'office_code',
        filterValue: filters['office_code'],
      })
    }

    setAppliedFilters(newFilters)
  }, [dates, dimensions, measures, filters, selectedMonth])

  return { appliedFilters }
}
