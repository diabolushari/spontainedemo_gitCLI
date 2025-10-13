'use client'

import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart } from 'recharts'
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
  sliceCount?: number
  sortOrder?: 'ascending' | 'descending'
}

export function CustomPieChart({
  data,
  dataKey,
  nameKey,
  keysToPlot,
  colors,
  fontSize,
  sliceCount,
  sortOrder = 'descending',
}: Props) {
  if (!data || data.length === 0 || keysToPlot.length === 0) {
    return <div className='px-4 py-2 text-sm text-muted-foreground'>No data available</div>
  }

  const processedData = useMemo(() => {
    if (!data) return []

    // Sort the data
    const sortedData = [...data].sort((a, b) => {
      const valA = Number(a[dataKey] || 0)
      const valB = Number(b[dataKey] || 0)
      return sortOrder === 'ascending' ? valA - valB : valB - valA
    })

    // Apply slice count if specified
    if (sliceCount && sortedData.length > sliceCount) {
      const topItems = sortedData.slice(0, sliceCount)
      const otherItems = sortedData.slice(sliceCount)

      const othersTotal = otherItems.reduce((sum, item) => sum + Number(item[dataKey] || 0), 0)

      const othersSlice = {
        [nameKey]: 'OTHER',
        [dataKey]: othersTotal,
      }

      return [...topItems, othersSlice]
    }

    return sortedData
  }, [data, dataKey, nameKey, sliceCount, sortOrder])

  const chartColors: string[] = chartPallet[colors]

  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.label,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  const totalValue = useMemo(() => {
    return processedData.reduce((sum, item) => sum + Number(item[dataKey] || 0), 0)
  }, [processedData, dataKey])

  const renderLegend = (value: string, entry: any) => {
    const itemValue = Number(entry.payload?.[dataKey] || 0)
    const percent = totalValue > 0 ? (itemValue / totalValue) * 100 : 0
    return `${value} (${percent.toFixed(2)}%)`
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={`${fontSize} h-[300px]`}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          formatter={(value: number | string, name: string) => {
            const formattedValue = formatNumber(Number(value))
            return [formattedValue, ' ' + name]
          }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={processedData}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={40}
          outerRadius={80}
          strokeWidth={1}
          labelLine={false}
        >
          {processedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>

        <Legend
          verticalAlign='bottom'
          layout='horizontal'
          align='center'
          iconSize={10}
          wrapperStyle={{
            paddingTop: 20,
            textTransform: 'uppercase',
          }}
          formatter={renderLegend}
        />
      </PieChart>
    </ChartContainer>
  )
}
