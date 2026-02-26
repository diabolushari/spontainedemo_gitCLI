import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import React, { Dispatch, SetStateAction } from 'react'
import { TrendSkeleton } from '../CustomChartSkeleton'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'

interface TrendWidgetProps {
  trendSubsetId: number | null
  trendMeasures: SelectedMeasure[]
  trendChartType: 'area' | 'bar' | null
  trendColor: string | null
  selectedMonth: Date | null
  setSelectedMonth: Dispatch<SetStateAction<Date | null>>
  onEditSection?: (section: string) => void
  suppressError?: boolean
}

export default function TrendWidget({
  trendSubsetId,
  trendMeasures,
  trendChartType,
  selectedMonth,
  setSelectedMonth,
  trendColor,
  onEditSection,
  suppressError = false,
}: Readonly<TrendWidgetProps>) {
  if (trendSubsetId == null || trendMeasures.length === 0) {
    return null
  }

  return (
    <div className='h-full w-full [container-type:inline-size]'>
      <div
        className='h-full w-full cursor-pointer transition-all hover:scale-[1.005]'
        onClick={() => onEditSection?.('trend')}
      >
        <TrendGraph
          subsetId={trendSubsetId}
          trendMeasures={trendMeasures}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType={trendChartType ?? 'area'}
          colorScheme={trendColor ?? undefined}
          suppressError={suppressError}
        />
      </div>
    </div>
  )
}

