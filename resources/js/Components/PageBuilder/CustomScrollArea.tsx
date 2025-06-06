import * as React from 'react'

import { ScrollArea } from '@/Components/ui/scroll-area'
import { EmptyCardBlock } from './EmptyCardBlock'

type CustomScrollAreaProps = {
  onChartClick: (id: number, name: string) => void
}
const pageBuilderCharts = [
  { id: 1, name: 'Active connection', component: <EmptyCardBlock /> },
  { id: 2, name: 'New connection', component: <EmptyCardBlock /> },
  { id: 3, name: 'Old', component: <EmptyCardBlock /> },
  { id: 4, name: 'New ', component: <EmptyCardBlock /> },
]

export function CustomScrollArea({ onChartClick }: CustomScrollAreaProps) {
  return (
    <ScrollArea className='h-48 w-[50%] rounded-md border'>
      <div className='p-4'>
        <h4 className='mb-4 text-sm font-medium leading-none'>Charts</h4>
        <div className='grid grid-cols-3 gap-2'>
          {pageBuilderCharts.map((chart) => (
            <>
              <div
                key={chart.id}
                role='button'
                tabIndex={0}
                onClick={() => onChartClick(chart.id, chart.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChartClick(chart.id, chart.name)
                  }
                }}
                className='group transform cursor-pointer rounded-md border border-solid p-2 text-sm shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {chart.name}
                <div style={{ pointerEvents: 'none' }}>{chart.component}</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
