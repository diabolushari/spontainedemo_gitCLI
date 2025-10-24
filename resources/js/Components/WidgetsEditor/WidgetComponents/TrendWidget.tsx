import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import { Dispatch, SetStateAction } from 'react'

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
  trendColor,
  selectedMonth,
  setSelectedMonth,
}: Readonly<TrendWidgetProps>) {
  return (
    <>
      {(trendSubsetId == null || subsetColumn == null || subsetFieldName == null) && (
        <div className='flex h-full items-center justify-center'>
          <div className='text-gray-500'>No data</div>
        </div>
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
          />
        </div>
      )}
    </>
  )
}
