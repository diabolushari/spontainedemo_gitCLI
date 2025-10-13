'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

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
  fontSize: string
  sliceCount?: number
  sortOrder?: 'ascending' | 'descending'
}

export function WidgetBarChart({
  data,
  dataKey,
  keysToPlot,
  colors,
  fontSize,
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
      className={`${fontSize} max-h-[400px] min-h-[200px]`}
    >
      <ResponsiveContainer
        width='100%'
        height={400}
      >
        <BarChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={0}
          />
          <YAxis
            tickFormatter={(value) => (formatNumber(value as number) ?? '').toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
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
