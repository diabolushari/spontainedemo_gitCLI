'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
    label: string
  }[]
  colors: string
  fontSize: string
}

export function CustomBarChart({ data, dataKey, keysToPlot, colors, fontSize }: Props) {
  if (!data || data.length === 0) {
    return <div className='px-4 py-2 text-sm text-muted-foreground'>No data available</div>
  }

  const chartColors: string[] = chartPallet[colors]
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
      className={`${fontSize}`}
    >
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
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
          {/* Tooltip shows values on hover */}
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
            content={<ChartTooltipContent indicator='dashed' />}
          />
          {keysToPlot.map((plotKey, index) => (
            <Bar
              key={plotKey.key}
              dataKey={plotKey.key}
              name={plotKey.label}
              fill={chartColors[index % chartColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
