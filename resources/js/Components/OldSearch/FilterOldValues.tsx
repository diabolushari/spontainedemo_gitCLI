import React, { useCallback } from 'react'

import BorderedPill from '@/ui/Pills/BorderedPill'
import { router } from '@inertiajs/react'

export interface AnnouncementListPageProperties {
  oldSearch: string
  oldStructure: string
}

interface Properties {
  oldValues?: Record<string, string>
}
const FilterOldValues = ({ oldValues }: Properties) => {
  const performSearchtest = useCallback(
    (key: string) => {
      router.get(
        `/meta-data-analytics`,
        {
          ...oldValues,
          [key]: '',
        },
        { preserveScroll: true }
      )
    },
    [oldValues]
  )

  const keys = Object.keys(oldValues ?? {})
    .filter((key) => {
      return !!(key !== 'type' && key !== 'subtype')
    })
    .filter((key) => {
      return oldValues != null && oldValues[key] != null
    })
  return (
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
  )
}

export default FilterOldValues
