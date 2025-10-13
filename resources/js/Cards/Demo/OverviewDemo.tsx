import React, { useEffect, useState } from 'react'

import { OverviewChart } from '@/interfaces/data_interfaces'
import OverviewGridDemo from './OverviewGridDemo'
import OverviewChartDemo from './OverviewBarChartDemo'

interface Props {
  content: any
}

export default function OverviewDemo({ content }: Props) {
  const { title, card_type, overview_chart, overview_table } = content || {}

  const [currentCardType, setCurrentCardType] = useState(card_type || 'chart_and_table')
  const [overviewChart, setOverviewChart] = useState<OverviewChart | null>(overview_chart)
  const [gridItems, setGridItems] = useState<any[]>(overview_table || [])

  const cardOptions = [
    { value: 'chart_and_table', label: 'Chart + Table' },
    { value: 'chart', label: 'Chart Only' },
    { value: 'table', label: 'Table Only' },
  ]

  const showTable = currentCardType === 'chart_and_table' || currentCardType === 'table'
  const showChart = currentCardType === 'chart_and_table' || currentCardType === 'chart'

  useEffect(() => {
    setOverviewChart(overview_chart)
  }, [overview_chart])

  useEffect(() => {
    setGridItems(overview_table)
  }, [overview_table])

  return (
    <div className='flex w-full flex-col transition-all duration-300'>
      <div className='flex items-center justify-between p-2'>
        <span className='subheader-sm-1stop'>{title}</span>
        <select
          value={currentCardType}
          onChange={(e) => setCurrentCardType(e.target.value)}
          className='rounded border px-2 py-1 text-sm'
        >
          {cardOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`grid ${showTable && showChart ? 'grid-cols-1 gap-4 md:grid-cols-2' : 'grid-cols-1'}`}
      >
        {showTable && (
          <div className=''>
            <OverviewGridDemo />
          </div>
        )}

        {showChart && (
          <div className='relative flex-1 rounded-md border border-gray-200'>
            <OverviewChartDemo />
          </div>
        )}
      </div>
    </div>
  )
}
