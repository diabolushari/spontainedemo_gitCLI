import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import { useMemo } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'

interface OverviewProps {
  subsetId: number
  measure: SelectedMeasure[]
  dimension: string
  chartType: string
  colorPalette: string
  highlightCards: HighlightCardData[]
  selectedMonth: Date
}

export default function OverviewWidgetContent({
  subsetId,
  measure,
  dimension,
  chartType,
  colorPalette,
  highlightCards,
  selectedMonth,
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

  return (
    <div>
      {chartType === 'bar' && data != null && (
        <div>
          <CustomBarChart
            data={data.data}
            dataKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            containerClassName={'text-sm aspect-video w-full transition-all xl:w-10/12'}
          />
        </div>
      )}
      {chartType === 'line' && data != null && (
        <div>
          <CustomLineChart
            data={data.data}
            dataKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
          />
        </div>
      )}
      {chartType === 'pie' && data != null && (
        <div>
          <CustomPieChart
            data={data.data}
            dataKey={fieldsToPlot[0].key}
            nameKey={dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            fontSize={'text-sm'}
          />
        </div>
      )}
    </div>
  )
}
