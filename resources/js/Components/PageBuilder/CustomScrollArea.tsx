import * as React from 'react'

import { ScrollArea } from '@/Components/ui/scroll-area'
import { EmptyCardBlock } from './EmptyCardBlock'
import Card from '@/ui/Card/Card'
import CardGridView from '../ListingPage/CardGridView'

type CustomScrollAreaProps = {
  onChartClick: (id: number | string) => void
  title: string
  data: any[]
  primaryKey: string
}
function buildCardViewData(data: any[]) {
  if (!data || data.length === 0) return { keys: [], rows: [] }

  const firstRow = data[0]

  const keys = Object.keys(firstRow)
    .filter((key) => key !== 'actions') // 'actions' is handled separately
    .map((key) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // prettify labels
      isCardHeader: key === 'name',
    }))

  const rows = data.map((item) => ({
    ...item,
    actions: item.actions ?? [],
  }))

  return { keys, rows }
}

export function CustomScrollArea({ onChartClick, title, data, primaryKey }: CustomScrollAreaProps) {
  const { keys, rows } = buildCardViewData(data)

  return (
    <ScrollArea className='h-48 w-full rounded-md border'>
      <div className='w-full'>
        <div>
          <CardGridView
            keys={keys}
            primaryKey={primaryKey}
            rows={rows}
            onCardClick={onChartClick}
            isAddButton={false}
          />
        </div>
      </div>
    </ScrollArea>
  )
}
