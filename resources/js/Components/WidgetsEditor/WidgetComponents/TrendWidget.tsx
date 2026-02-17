import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import React, { Dispatch, SetStateAction } from 'react'
import { TrendSkeleton } from '../CustomChartSkeleton'

interface TrendWidgetProps {
  trendSubsetId: number | null
  subsetColumn: string | null
  subsetFieldName: string | null
  trendChartType: 'area' | 'bar' | null
  trendColor: string | null
  selectedMonth: Date | null
  setSelectedMonth: Dispatch<SetStateAction<Date | null>>
  onEditSection?: (section: string) => void
  suppressError?: boolean
}

export default function TrendWidget({
  trendSubsetId,
  subsetColumn,
  subsetFieldName,
  trendChartType,
  selectedMonth,
  setSelectedMonth,
  trendColor,
  onEditSection,
  suppressError = false,
}: Readonly<TrendWidgetProps>) {
  if (trendSubsetId == null || subsetColumn == null || subsetFieldName == null) {
    return null
  }

  return (
    <div
      className='cursor-pointer transition-all hover:scale-[1.005]'
      onClick={() => onEditSection?.('trend')}
    >
      <TrendGraph
        subsetId={trendSubsetId}
        dataField={subsetColumn}
        dataFieldName={subsetFieldName ?? ''}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        chartType={trendChartType ?? 'area'}
        colorScheme={trendColor ?? undefined}
        suppressError={suppressError}
      />
    </div>
  )
}

