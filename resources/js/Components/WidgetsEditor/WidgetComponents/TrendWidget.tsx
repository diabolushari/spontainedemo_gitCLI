import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import React, { Dispatch, SetStateAction } from 'react'

interface TrendWidgetProps {
  trendSubsetId: number | null
  subsetColumn: string | null
  subsetFieldName: string | null
  trendChartType: 'area' | 'bar' | null
  trendColor: string | null
  selectedMonth: Date | null
  setSelectedMonth: Dispatch<SetStateAction<Date | null>>
}

export default function TrendWidget({
  trendSubsetId,
  subsetColumn,
  subsetFieldName,
  trendChartType,
  selectedMonth,
  setSelectedMonth,
  trendColor,
}: Readonly<TrendWidgetProps>) {
  return (
    <>
      {(trendSubsetId == null || subsetColumn == null || subsetFieldName == null) && (
        <ChartSkeleton />
      )}
      {trendSubsetId != null && subsetColumn != null && subsetFieldName != null && (
        <div>
          <TrendGraph
            subsetId={trendSubsetId}
            dataField={subsetColumn}
            dataFieldName={subsetFieldName ?? ''}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            chartType={trendChartType ?? 'area'}
            colorScheme={trendColor}
          />
        </div>
      )}
    </>
  )
}

const ChartSkeleton: React.FC = () => {
  return (
    <div className='flex h-full w-full overflow-hidden rounded-lg bg-white p-4 sm:p-6'>
      <div className='flex h-full w-full flex-col'>
        {/* Period selector skeleton */}
        <div className='mb-4 flex gap-2'>
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
        </div>

        {/* Chart container */}
        <div className='relative min-h-0 flex-1'>
          {/* Y-axis labels skeleton */}
          <div className='absolute left-0 top-0 flex h-full flex-col justify-between py-4 text-sm'>
            <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-10 animate-pulse rounded bg-gray-200' />
          </div>

          {/* Chart area skeleton */}
          <div className='ml-20 h-full rounded border border-dashed border-gray-200 bg-gray-100' />

          {/* X-axis labels skeleton */}
          <div className='ml-20 mt-2 flex justify-between text-sm'>
            <div className='h-4 w-14 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-14 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-14 animate-pulse rounded bg-gray-200' />
          </div>
        </div>
      </div>
    </div>
  )
}
