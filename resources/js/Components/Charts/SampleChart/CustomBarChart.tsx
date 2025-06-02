"use client"

import { TrendingUp } from "lucide-react"
import { ResponsiveContainer } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"
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
    label: "UV",
    color: "hsl(var(--chart-1))",
  },
  pv: {
    label: "PV",
    color: "hsl(var(--chart-2))",
  },
  amt: {
    label: "AMT",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function CustomBarChart() {
  return (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart accessibilityLayer data={chartData}
             margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
             >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="uv" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pv" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                {/* <Bar dataKey="amt" fill="var(--color-amt)" radius={4} /> */}

            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
  )
}
