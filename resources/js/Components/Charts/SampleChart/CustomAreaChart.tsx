import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

interface Props {
  data: Record<string, number | string>[]
  dataKey: string
  keysToPlot: {
    key: string
  }[]
}

export function CustomAreaChart({ data, dataKey, keysToPlot }: Props) {
  const chartConfig = keysToPlot.reduce((acc, plotKey, index) => {
    acc[plotKey.key] = {
      label: plotKey.key,
      color: chartColors[index % chartColors.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer
        width='100%'
        height={200}
      >
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={true}
            axisLine={true}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator='dot' />}
          />
          {keysToPlot.map((plotKey, index) => (
            <Area
              key={plotKey.key}
              dataKey={plotKey.key}
              type='natural'
              fill={chartColors[index % chartColors.length]}
              fillOpacity={0.4}
              stroke={chartColors[index % chartColors.length]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
