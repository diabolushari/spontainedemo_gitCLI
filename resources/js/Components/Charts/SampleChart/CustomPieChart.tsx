'use client'

import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { Cell, Legend, Pie, PieChart } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  nameKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colorScheme?: string
  fontSize: string
  sliceCount?: number
  sortOrder?: 'ascending' | 'descending'
  /**
   * Fixed height for the chart container. Using a fixed height prevents the
   * donut from being vertically cropped when legends/tooltips change the
   * computed layout. Defaults to 400.
   */
  height?: number
}

export function CustomPieChart({
  data,
  dataKey,
  nameKey,
  keysToPlot,
  colorScheme = 'boldWarm',
  fontSize,
}: Readonly<Props>) {
  const chartColors: string[] = chartPallet[colorScheme as keyof typeof chartPallet] ?? []

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.label,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className={`${fontSize} h-[450px] w-full transition-all xl:w-10/12`}
    >
      <PieChart margin={{ top: 16, bottom: 32, left: 16, right: 16 }}>
        <Legend />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          // Use percentage radii so the donut scales with container size and avoids clipping.
          innerRadius='55%'
          outerRadius='85%'
          strokeWidth={1}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              // eslint-disable-next-line react/no-array-index-key
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
