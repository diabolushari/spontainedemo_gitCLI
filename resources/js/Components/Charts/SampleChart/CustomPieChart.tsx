'use client'

import { useMemo } from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

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
  nameKey: string
  keysToPlot: {
    key: string
    label: string
    unit?: string
  }[]
  colors: string
  fontSize: string
}

export function CustomPieChart({ data, dataKey, nameKey, keysToPlot, colors, fontSize }: Props) {
  if (!data || data.length === 0 || keysToPlot.length === 0) {
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

  const selectedKey = keysToPlot[0] // Only one key expected for pie
  const labelText = `${selectedKey.label}${selectedKey.unit ? ` (${selectedKey.unit})` : ''}`

  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item[dataKey] || 0), 0)
  }, [data, dataKey])

  return (
    <ChartContainer
      config={chartConfig}
      className={`${fontSize}`}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          formatter={(value: number | string, name: string) => {
            const formattedValue = formatNumber(Number(value))
            return [formattedValue, name]
          }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={30}
          outerRadius={60}
          strokeWidth={1}
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}

          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                    dominantBaseline='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground text-2xl font-bold'
                    >
                      {formatNumber(totalValue)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className='fill-muted-foreground text-sm'
                    >
                      {labelText}
                    </tspan>
                  </text>
                )
              }
              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
