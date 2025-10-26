import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import HighlightBar from '@/Components/WidgetsEditor/WidgetComponents/HighlightBar'
import useFetchRecord from '@/hooks/useFetchRecord'
import { useMemo } from 'react'
import { HighlightCardData } from '../ConfigSection/HighlightConfigSection'

interface OverviewProps {
  block: {
    subset_id: number
    measure: SelectedMeasure[]
    dimension: string
    chart_type: string
    color_palette: string
    hl_cards: HighlightCardData[]
  }
  selectedMonth: Date
}

interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit: string
}

export default function OverviewWidgetContent({ block, selectedMonth }: Readonly<OverviewProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  // Build fields parameter: dimension + all measure columns
  const fieldsParam = useMemo(() => {
    const measureColumns = Array.isArray(block?.measure)
      ? block.measure.map((m: SelectedMeasure) => m.subset_column).join(',')
      : ''

    return block?.dimension && measureColumns ? `${block.dimension},${measureColumns}` : ''
  }, [block?.measure, block?.dimension])

  const url = useMemo(() => {
    return block?.subset_id && fieldsParam
      ? `/subset/${block.subset_id}?month=${formattedMonth}&fields=${fieldsParam}`
      : null
  }, [block?.subset_id, fieldsParam, formattedMonth])

  const [data] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(url)

  const fieldsToPlot = useMemo(() => {
    const allMeasures = Array.isArray(block?.measure)
      ? block?.measure.map((m: SelectedMeasure) => ({
          key: m.subset_column,
          label: m.subset_field_name,
          unit: m.unit,
        }))
      : []

    if (block?.chart_type === 'pie') {
      return allMeasures.slice(0, 1)
    }

    return allMeasures
  }, [block?.measure, block?.chart_type])

  const hasHighlightData = block.hl_cards != null && block.hl_cards.length > 0

  const hasChartData =
    block?.dimension != null && block?.dimension !== '' && fieldsToPlot.length > 0

  return (
    <div>
      {hasHighlightData && (
        <HighlightBar
          highlightCards={block.hl_cards}
          selectedMonth={selectedMonth}
        />
      )}
      {hasChartData ? (
        <>
          {block?.chart_type === 'bar' && data != null && (
            <div>
              <CustomBarChart
                data={data.data}
                dataKey={block.dimension}
                keysToPlot={fieldsToPlot}
                colorScheme={block?.color_palette}
                containerClassName={'text-sm aspect-video w-full transition-all xl:w-10/12'}
              />
            </div>
          )}
          {block?.chart_type === 'line' && data != null && (
            <div>
              <CustomLineChart
                data={data.data}
                dataKey={block.dimension}
                keysToPlot={fieldsToPlot}
                colorScheme={block?.color_palette}
              />
            </div>
          )}
          {block?.chart_type === 'pie' && data != null && (
            <div>
              <CustomPieChart
                data={data.data}
                dataKey={fieldsToPlot[0].key}
                nameKey={block.dimension}
                keysToPlot={fieldsToPlot}
                colorScheme={block?.color_palette}
                fontSize={'text-sm'}
              />
            </div>
          )}
        </>
      ) : (
        !hasHighlightData && (
          <div className='flex h-64 items-center justify-center text-slate-400'>
            No data available to display
          </div>
        )
      )}
    </div>
  )
}
