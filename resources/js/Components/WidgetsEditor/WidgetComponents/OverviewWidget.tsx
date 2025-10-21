import useFetchRecord from '@/hooks/useFetchRecord'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import HighlightBar from '@/Components/WidgetsEditor/WidgetComponents/HighlightBar'
import { WidgetBarChart } from '@/Components/WidgetsEditor/Charts/WidgetBarChart'
import { WidgetLineChart } from '@/Components/WidgetsEditor/Charts/WidgetLineChart'

interface OverviewProps {
  block: {
    subset_id: number
    measure: SelectedMeasure[]
    dimension: string
    chart_type: string
    color_palette: string
    hl_cards: any
  }
  selectedMonth: Date
}

interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit: string
}

export default function OverviewWidget({ block, selectedMonth }: Readonly<OverviewProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  // Extract measure columns and join them for API query
  const measureColumns = Array.isArray(block?.measure)
    ? block.measure.map((m: SelectedMeasure) => m.subset_column).join(',')
    : ''

  // Build fields parameter: dimension + all measure columns
  const fieldsParam =
    block?.dimension && measureColumns ? `${block.dimension},${measureColumns}` : ''

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    block?.subset_id && fieldsParam
      ? `/subset/${block.subset_id}?month=${formattedMonth}&fields=${fieldsParam}`
      : null
  )

  // Create keysToPlot array from measures
  const keysToPlot = Array.isArray(block?.measure)
    ? block.measure.map((m: SelectedMeasure) => ({
        key: m.subset_column,
        label: m.subset_field_name,
        unit: m.unit,
      }))
    : []

  // Get first measure for pie chart and highlight bar
  const firstMeasure =
    Array.isArray(block?.measure) && block.measure.length > 0 ? block.measure[0] : null

  // Check if we have data for HighlightBar
  const hasHighlightData = block.hl_cards

  // Check if we have data for charts (requires dimension)
  const hasChartData = hasHighlightData && block?.dimension

  return (
    <div>
      {hasHighlightData && (
        <HighlightBar
          hlCards={block.hl_cards}
          selectedMonth={selectedMonth}
        />
      )}
      {hasChartData ? (
        <>
          {block?.chart_type === 'bar' && data != null && (
            <div>
              <WidgetBarChart
                data={data.data}
                dataKey={block.dimension}
                keysToPlot={keysToPlot}
                colors={block?.color_palette}
                fontSize={'text-sm'}
              />
            </div>
          )}
          {block?.chart_type === 'line' && (
            <div>
              <WidgetLineChart
                data={data.data}
                dataKey={block.dimension}
                keysToPlot={keysToPlot}
                colors={block?.color_palette}
              />
            </div>
          )}
          {block?.chart_type === 'pie' && firstMeasure && (
            <div>
              <CustomPieChart
                data={data.data}
                dataKey={firstMeasure.subset_column}
                nameKey={block.dimension}
                keysToPlot={[
                  {
                    key: firstMeasure.subset_column,
                    label: firstMeasure.subset_field_name,
                    unit: firstMeasure.unit,
                  },
                ]}
                colors={block?.color_palette}
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
