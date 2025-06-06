'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'

export const description = 'A multiple line chart'

const chartData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

const chartConfig = {
  uv: {
    label: 'UV',
    color: '#2563eb',
  },
  pv: {
    label: 'PV',
    color: '#60a5fa',
  },
} satisfies ChartConfig

export function CustomLineChart({ data, dataKey, keysToPlot }: Props) {
  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.key,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='name'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          //tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          dataKey='uv'
          type='monotone'
          stroke='#2563eb'
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey='pv'
          type='monotone'
          stroke='#60a5fa'
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
