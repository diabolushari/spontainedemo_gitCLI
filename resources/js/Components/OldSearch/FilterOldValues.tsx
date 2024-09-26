import React, { useCallback } from 'react'

import BorderedPill from '@/ui/Pills/BorderedPill'
import { router } from '@inertiajs/react'

export interface AnnouncementListPageProperties {
  oldSearch: string
  oldStructure: string
}

interface Properties {
  oldValues?: Record<string, string>
  searchUrl?: string
}
const FilterOldValues = ({ oldValues, searchUrl }: Properties) => {
  const performSearchtest = useCallback(
    (key: string) => {
      if (searchUrl == null) {
        return
      }

      router.get(
        searchUrl,
        {
          ...oldValues,
          [key]: '',
        },
        { preserveScroll: true }
      )
    },
    [oldValues, searchUrl]
  )

  const keys = Object.keys(oldValues ?? {})
    .filter((key) => {
      return !!(key !== 'type' && key !== 'subtype')
    })
    .filter((key) => {
      return oldValues != null && oldValues[key] != null
    })

  return (
    <div className='flex gap-5 py-4'>
      {keys.length > 0 && <span className='pl-4 text-left'>Searched for: </span>}
      <div className='flex flex-wrap justify-center gap-5'>
        {oldValues != null &&
          keys.map((key) => (
            <BorderedPill
              key={key}
              value={oldValues[key as keyof typeof oldValues]}
              onClose={() => performSearchtest(key)}
            />
          ))}
      </div>
    </div>
  )
}

export default FilterOldValues
