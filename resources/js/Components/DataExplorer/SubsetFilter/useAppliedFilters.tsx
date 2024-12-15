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
import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'

const additionalOperations = [
  { operation: 'in list', value: '_in' },
  { operation: 'not in list', value: '_not_in' },
]

export interface AppliedSubsetFilterItem {
  id: number
  filter: string
  filterKey: string
  filterValue: string
}

export default function useAppliedFilters(
  filters: Record<string, string>,
  selectedMonth: Date | null,
  offices: OfficeData[],
  dates?: SubsetDateField[],
  dimensions?: SubsetDimensionField[],
  measures?: SubsetMeasureField[]
) {
  const [appliedFilters, setAppliedFilters] = useState<AppliedSubsetFilterItem[]>([])

  useEffect(() => {
    const allFilters: Record<string, string | undefined | null> = {
      ...filters,
      month: dateToYearMonth(selectedMonth),
    }

    const newFilters: AppliedSubsetFilterItem[] = []

    let uuidCounter = 1

    dates?.forEach((date) => {
      const allOperations = [...dateOperations, ...additionalOperations]
      allOperations.forEach((dateOperation) => {
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
      const allOperations = [...dimensionOperations, ...additionalOperations]
      allOperations.forEach((dimensionOperation) => {
        const filter = `${dimension.subset_column}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        if (allFilters[filter] != null && allFilters[filter] !== '') {
          newFilters.push({
            id: uuidCounter++,
            filter: `${dimension.subset_field_name} ${dimensionOperation.operation} ${allFilters[filter]}`,
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
            filter: `${measure.subset_field_name} ${measureOperation.operation} ${allFilters[filter]}`,
            filterKey: filter,
            filterValue: allFilters[filter],
          })
        }
      })
    })

    if (filters['office_code'] != null) {
      const office = offices.find((office) => office.office_code === allFilters['office_code'])
      let officeName = allFilters['office_code']
      if (office != null) {
        officeName = `${office.office_name} (${office.office_code}) - ${office.level}`
      }
      newFilters.push({
        id: uuidCounter++,
        filter: `Office Code ${officeName}`,
        filterKey: 'office_code',
        filterValue: allFilters['office_code'] ?? '',
      })
    }

    setAppliedFilters(newFilters)
  }, [dates, dimensions, measures, filters, offices, selectedMonth])

  return { appliedFilters }
}
