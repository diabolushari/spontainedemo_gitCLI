'use client'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colors: string
  fontSize?: string
  sliceCount?: number
  displayKey?: string
  displayKeyShow?: boolean
  sortOrder?: 'ascending' | 'descending'
}

export function CustomLineChart({
  data,
  dataKey,
  keysToPlot,
  colors,
  displayKey,
  displayKeyShow,
  fontSize = '',
  sliceCount,
  sortOrder = 'descending',
}: Props) {
  const chartColors: string[] = chartPallet[colors]

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: `${plotKey.label}${plotKey.unit ? ` (${plotKey.unit})` : ''}`,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    const sorted = [...data].sort((a, b) => {
      const valA = Number(a[keysToPlot[0].key] || 0)
      const valB = Number(b[keysToPlot[0].key] || 0)
      return sortOrder === 'ascending' ? valA - valB : valB - valA
    })

    if (sliceCount && sorted.length > sliceCount) {
      return sorted.slice(0, sliceCount)
    }

    return sorted
  }, [data, keysToPlot, sliceCount, sortOrder])

  if (!processedData || processedData.length === 0) {
    return <div className='px-4 py-2 text-sm text-muted-foreground'>No data available</div>
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={fontSize}
    >
      <ResponsiveContainer
        width='100%'
        height={300}
      >
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={25}
            label={
              displayKeyShow
                ? {
                    value: `${displayKey}`,
                    position: 'insideBottom',
                    textAnchor: 'middle',
                  }
                : ''
            }
            minTickGap={10}
            axisLine={false}
            interval={0}
            tick={{ angle: 15, textAnchor: 'top', fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={35}
            tick={{ angle: 0, textAnchor: 'top', fontSize: 12 }}
            label={{
              value:
                keysToPlot.length === 1
                  ? `${keysToPlot[0].label}${keysToPlot[0].unit ? ` (${keysToPlot[0].unit})` : ''}`
                  : 'Value',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <ChartTooltip
            cursor={false}
            formatter={(value: number | string, name: string) => {
              const matchingKey = keysToPlot.find((k) => k.label === name)
              const formattedValue = formatNumber(Number(value))
              const label = matchingKey
                ? `${matchingKey.label}${matchingKey.unit ? ` (${matchingKey.unit})` : ''}`
                : name
              return [formattedValue, label]
            }}
            content={<ChartTooltipContent />}
          />

          {keysToPlot.map((plotKey, index) => (
            <Line
              key={plotKey.key}
              dataKey={plotKey.key}
              name={plotKey.label}
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
