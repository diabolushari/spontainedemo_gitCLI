import React, { Dispatch, SetStateAction } from 'react'
import { AppliedSubsetFilterItem } from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'

interface Props {
  appliedFilter: AppliedSubsetFilterItem
  setSearchParams: Dispatch<SetStateAction<Record<string, string>>>
  setSelectedMonth: Dispatch<SetStateAction<Date | null>>
}

export default function AppliedSubsetFilter({
  appliedFilter,
  setSearchParams,
  setSelectedMonth,
}: Readonly<Props>) {
  const removeFilter = (filterKey: string) => {
    if (filterKey === 'month') {
      setSelectedMonth(null)
      return
    }

    setSearchParams((oldValues) => {
      const keys = Object.keys(oldValues)
      const remainingFilters: Record<string, string> = {}

      keys
        .filter((key) => key != filterKey)
        .forEach((key) => {
          remainingFilters[key] = oldValues[key]
        })

      return remainingFilters
    })
  }

  return (
    <div
      className='flex justify-between gap-5 bg-1stop-gray p-2'
      key={appliedFilter.id}
    >
      <span>{appliedFilter.filter}</span>
      <button onClick={() => removeFilter(appliedFilter.filterKey)}>
        <i className='la la-close' />
      </button>
    </div>
  )
}
