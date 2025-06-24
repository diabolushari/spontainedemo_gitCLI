'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
    label: string
    unit: string
  }[]
}

const chartColors = [
  '#2563eb', // blue-600
  '#60a5fa', // blue-400
  '#f59e0b', // amber-500
  '#10b981', // green-500
  '#ef4444', // red-500
]

export function CustomLineChart({ data, dataKey, keysToPlot }: Props) {
  if (!data || data.length === 0) {
    return <div className='px-4 py-2 text-sm text-muted-foreground'>No data available</div>
  }

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.label,
      color: chartColors[index % chartColors.length],
      unit: plotKey.unit,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={10}
            minTickGap={40}
            axisLine={false}
            interval={0} // show all ticks
            tick={{ angle: -45, textAnchor: 'end', fontSize: 8 }}
          />

          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: keysToPlot.length === 1 ? keysToPlot[0].label : 'Value',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <ChartTooltip
            cursor={false}
            formatter={(value: number | string, name: string) => {
              const matchingKey = keysToPlot.find((k) => k.key === name)
              const formattedValue = formatNumber(Number(value))
              const labelWithUnit = matchingKey
                ? `${matchingKey.label}${matchingKey.unit ? ` (${matchingKey.unit})` : ''}`
                : name
              return [formattedValue, labelWithUnit]
            }}
            content={<ChartTooltipContent />}
          />
          {keysToPlot.map((plotKey, index) => (
            <Line
              key={plotKey.key}
              dataKey={plotKey.key}
              type='monotone'
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
