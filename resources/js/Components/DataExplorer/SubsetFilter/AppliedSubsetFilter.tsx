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
      className='flex w-full items-center justify-between gap-5 rounded-xl border-2 border-1stop-gray bg-1stop-white p-2'
      key={appliedFilter.id}
    >
      <div className='flex-shrink-1 w-full'>
        <span className='axial-label-1stop break-words capitalize'>{appliedFilter.filter}</span>
      </div>
      <button
        className='flex-grow'
        onClick={() => removeFilter(appliedFilter.filterKey)}
      >
        <i className='la la-close' />
      </button>
    </div>
  )
}
