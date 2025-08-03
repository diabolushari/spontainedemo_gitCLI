import React, { useState } from 'react'
import { Calendar, Grid, Info, List, PieChart as PieChartIcon } from 'lucide-react'

const PieChartBlock = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className='w-full rounded-2xl bg-white p-10 shadow'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>Block Descriptive Title</h2>
          <Info className='h-4 w-4 text-blue-400' />
        </div>

        {/* Tabs */}
        <div className='flex items-center gap-2'>
          <button
            className={`rounded p-2 ${activeTab === 0 ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            <Grid className='h-4 w-4' />
          </button>
          <button
            className={`rounded p-2 ${activeTab === 1 ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <List className='h-4 w-4' />
          </button>
          <button
            className={`rounded p-2 ${activeTab === 2 ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            <PieChartIcon className='h-4 w-4' />
          </button>
          <div className='rounded bg-gray-100 px-2 py-1 text-sm text-gray-400'>Mon, YYYY</div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 0 && (
        <div className='flex items-center justify-between'>
          {/* KPI Values */}
          <div className='flex flex-col gap-6'>
            <div>
              <div className='text-2xl font-bold'>######</div>
              <div className='mt-1 text-xs text-gray-500'>KPI 1</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>####</div>
              <div className='mt-1 text-xs text-gray-500'>KPI 2</div>
            </div>
            <div>
              <div className='text-2xl font-bold'>####</div>
              <div className='mt-1 text-xs text-gray-500'>KPI 3</div>
            </div>
          </div>

          {/* Pie Chart Placeholder */}
          <div className='h-40 w-40 rounded-full bg-gray-100'></div>
        </div>
      )}

      {activeTab !== 0 && (
        <div className='flex h-32 items-center justify-center text-sm text-gray-400'>
          This tab is not functional yet.
        </div>
      )}
    </div>
  )
}

export default PieChartBlock
