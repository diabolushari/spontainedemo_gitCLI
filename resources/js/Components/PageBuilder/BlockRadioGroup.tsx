import React from 'react'
import { Grid, List, BarChart2 } from 'lucide-react'
import { Block } from '@/interfaces/data_interfaces'

interface BlockRadioGroupProps {
  selectedView: string
  setSelectedView: (value: string) => void
  block?: Block
}

export function BlockRadioGroup({ block, selectedView, setSelectedView }: BlockRadioGroupProps) {
  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <Grid className='h-4 w-4' />,
      show:
        block?.data?.overview?.overview_chart ||
        block?.data?.overview?.overview_table ||
        block?.data?.overview_selected,
    },
    {
      value: 'trend',
      label: 'Trend',
      icon: <List className='h-4 w-4' />,
      show: !!block?.data?.trend_selected,
    },
    {
      value: 'ranking',
      label: 'Ranking',
      icon: <BarChart2 className='h-4 w-4' />,
      show: !!block?.data?.ranking_selected,
    },
  ]

  const visibleTabs = tabs.filter((tab) => tab.show)

  if (visibleTabs.length === 0) {
    return (
      <div className='rounded border bg-gray-50 px-2 py-1 text-sm text-gray-500'>
        Set an Overview, Chart, or Ranking configuration for this block.
      </div>
    )
  }

  return (
    <div className='absolute right-2 top-2 flex gap-2 rounded-md bg-gray-100 p-1'>
      {visibleTabs.map((tab) => (
        <div
          key={tab.value}
          className='group relative'
        >
          <button
            onClick={() => setSelectedView(tab.value)}
            className={`flex items-center justify-center rounded-md p-2 transition-colors ${
              selectedView === tab.value
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
          </button>

          {/* Tooltip */}
          <div className='absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            {tab.label}
          </div>
        </div>
      ))}
    </div>
  )
}
