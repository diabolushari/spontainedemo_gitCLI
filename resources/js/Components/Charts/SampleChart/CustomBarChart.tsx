'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colorScheme?: string
  xAxisLabel?: string
  yAxisLabel?: string
  sliceCount?: number
  sortOrder?: 'ascending' | 'descending'
  containerClassName?: string
}

const tickFormatter = (value: number | string) => {
  const str = String(value)
  return str.length > 10 ? str.substring(0, 7) + '...' : str
}

export function CustomBarChart({
  data,
  dataKey,
  keysToPlot,
  colorScheme = 'boldWarm',
  containerClassName = 'aspect-video w-full transition-all xl:w-10/12',
}: Readonly<Props>) {
  const chartColors: string[] = chartPallet[colorScheme as keyof typeof chartPallet] ?? []

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    const unit = plotKey.unit ? ` (${plotKey.unit})` : ''
    acc[plotKey.key] = {
      label: `${plotKey.label}${unit}`,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className={containerClassName}
    >
      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          maxBarSize={60}
          barCategoryGap='20%'
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={15}
            axisLine={false}
            type='category'
            interval='preserveStartEnd'
            angle={-45}
            textAnchor='end'
            height={70}
            tick={{ fontSize: 12 }}
            tickFormatter={tickFormatter}
          />
          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {keysToPlot.map((plotKey, index) => (
            <Bar
              key={plotKey.key}
              dataKey={plotKey.key}
              name={plotKey.label}
              fill={chartColors[index % chartColors.length]}
              radius={[8, 8, 8, 8]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
