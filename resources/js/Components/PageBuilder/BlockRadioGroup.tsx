import { Block } from '@/interfaces/data_interfaces'
import React from 'react'

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
      show:
        block?.data?.overview?.overview_chart?.subset_id ||
        block?.data?.overview?.overview_table?.subset_id,
    },
    { value: 'trend', label: 'Trend', show: !!block?.data?.trend?.subset_id },
    { value: 'rank', label: 'Ranking', show: !!block?.data?.ranking?.subset_id },
  ]

  const visibleTabs = tabs.filter((tab) => tab.show)

  // If no data exists for any tab, show message instead of buttons
  if (visibleTabs.length === 0) {
    return (
      <div className='rounded border bg-gray-50 px-2 py-1 text-sm text-gray-500'>
        Set an Overview, Chart, or Ranking configuration for this block.
      </div>
    )
  }

  return (
    <div className='flex w-max gap-2 rounded-md bg-gray-100 p-1'>
      {visibleTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setSelectedView(tab.value)}
          className={`rounded-md px-4 py-1 text-sm font-medium transition-colors ${
            selectedView === tab.value
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
