import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'

export default function OverviewChartDemo({
  chartContent,
  selectedMonth,
  setSelectedMonth,
}: {
  chartContent: any
  selectedMonth: Date | null
  setSelectedMonth: (month: Date | null) => void
}) {
  return (
    <div>
      <h1>Overview Chart Demo</h1>
      <CustomBarChart
        data={chartContent.data}
        dataKey={chartContent.dataKey}
        keysToPlot={chartContent.keysToPlot}
        colors={chartContent.colors}
        fontSize={chartContent.fontSize}
        sliceCount={chartContent.sliceCount}
        sortOrder={chartContent.sortOrder}
      />
    </div>
  )
}
