import useFetchRecord from '@/hooks/useFetchRecord'
import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import HighlightBar from '@/Components/WidgetsEditor/HighlightBar'

interface OverviewProps {
  block: any
  selectedMonth: Date
}

interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
}

export default function Overview({ block, selectedMonth }: Readonly<OverviewProps>) {
  console.log(selectedMonth)
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

  console.log(data)
  // Create keysToPlot array from measures
  const keysToPlot = Array.isArray(block?.measure)
    ? block.measure.map((m: SelectedMeasure) => ({
        key: m.subset_column,
        label: m.subset_field_name,
        unit: '', // You can add unit to the measure object if needed
      }))
    : []

  // Get first measure for pie chart (pie charts typically show one measure)
  const firstMeasure =
    Array.isArray(block?.measure) && block.measure.length > 0 ? block.measure[0] : null

  // Don't render if data is not ready or no measures selected
  if (!data?.data || !Array.isArray(block?.measure) || block.measure.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-slate-400'>
        {loading ? 'Loading...' : 'Please select measures and dimension to display chart'}
      </div>
    )
  }

  return (
    <div>
      <HighlightBar
        data={data.data}
        subsetColumn={firstMeasure.subset_column}
      />
      {block?.chart_type === 'bar' && (
        <div>
          <CustomBarChart
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
          <CustomLineChart
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
                unit: '',
              },
            ]}
            colors={block?.color_palette}
            fontSize={'text-sm'}
          />
        </div>
      )}
    </div>
  )
}
