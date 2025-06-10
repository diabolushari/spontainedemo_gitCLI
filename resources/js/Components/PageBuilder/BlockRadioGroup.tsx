import { Block } from '@/interfaces/data_interfaces'
import React from 'react'

interface BlockRadioGroupProps {
  selectedView: string
  setSelectedView: (value: string) => void
  block?: Block
}

export function BlockRadioGroup({ block, selectedView, setSelectedView }: BlockRadioGroupProps) {
  const tabs = [
    { value: 'overview', label: 'Overview', show: true },
    { value: 'trend', label: 'Trend', show: !!block?.data?.trend },
    { value: 'rank', label: 'Ranking', show: !!block?.data?.ranking },
  ]
  return (
    <div className='flex w-max gap-2 rounded-md bg-gray-100 p-1'>
      {tabs
        .filter((tab) => tab.show)
        .map((tab) => (
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
