import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import { useMemo } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { DotIcon, EllipsisIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from '@inertiajs/react'

interface SubsetGroupDetail {
  name: string
  description: string
}

interface OverviewProps {
  subsetId: number
  measure: SelectedMeasure[]
  dimension: string
  chartType: string
  colorPalette: string
  highlightCards: HighlightCardData[]
  selectedMonth: Date
  compact?: boolean
}

export default function OverviewWidgetContent({
  subsetId,
  measure,
  dimension,
  chartType,
  colorPalette,
  highlightCards,
  selectedMonth,
  compact = false,
}: Readonly<OverviewProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  // Build fields parameter: dimension + all measure columns
  const fieldsParam = useMemo(() => {
    const measureColumns = Array.isArray(measure)
      ? measure.map((m: SelectedMeasure) => m.subset_column).join(',')
      : ''

    return dimension && measureColumns ? `${dimension},${measureColumns}` : ''
  }, [measure, dimension])

  const url = useMemo(() => {
    return subsetId && fieldsParam
      ? `/subset/${subsetId}?month=${formattedMonth}&fields=${fieldsParam}`
      : null
  }, [subsetId, fieldsParam, formattedMonth])
  console.log('overview url', url)

  const [data] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(url)

  const fieldsToPlot = useMemo(() => {
    const allMeasures = Array.isArray(measure)
      ? measure.map((m: SelectedMeasure) => ({
          key: m.subset_column,
          label: m.subset_field_name,
          unit: m.unit,
        }))
      : []

    if (chartType === 'pie') {
      return allMeasures.slice(0, 1)
    }

    return allMeasures
  }, [measure, chartType])

  const containerClass = compact ? 'h-full w-full aspect-auto' : 'h-full w-full'
  const chartMargin = compact ? { top: 5, right: 5, left: 5, bottom: 5 } : undefined
  const axisHeight = compact ? 30 : undefined

  return (
    <div className='min-h-0 w-full flex-1'>
      {chartType === 'bar' && data != null && (
        <div className='h-full w-full'>
          <CustomBarChart
            data={data.data}
            dataKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            containerClassName={containerClass}
            margin={chartMargin}
            xAxisHeight={axisHeight}
          />
        </div>
      )}
      {chartType === 'line' && data != null && (
        <div className='h-full w-full'>
          <CustomLineChart
            data={data.data}
            dataKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            containerClassName={containerClass}
            margin={chartMargin}
            xAxisHeight={axisHeight}
          />
        </div>
      )}
      {chartType === 'pie' && data != null && (
        <div className='h-full w-full'>
          <CustomPieChart
            data={data.data}
            dataKey={fieldsToPlot[0].key}
            nameKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            fontSize={'text-sm'}
            containerClassName={containerClass}
          />
        </div>
      )}
    </div>
  )
}
