"use client"

import { ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/Components/ui/card"
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


export function CustomAreaChart() {
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Area Chart - Stacked</CardTitle>
    //     <CardDescription>
    //       Showing total visitors for the last 6 months
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>

       <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              {/* <AreaChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              > */}
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="uv"
                type="natural"
                fill="#2563eb"
                fillOpacity={0.4}
                stroke="#2563eb"
                // stackId="a"
              />
              <Area
                dataKey="pv"
                type="natural"
                fill="#60a5fa"
                fillOpacity={0.4}
                stroke="#60a5fa"
                // stackId="a"
              />
              <Area
                dataKey="amt"
                type="natural"
                fill="var(--color-amt)"
                fillOpacity={0.4}
                stroke="var(--color-amt)"
                // stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

    //   </CardContent>
    //   <CardFooter>
    //     <div className="flex w-full items-start gap-2 text-sm">
    //       <div className="grid gap-2">
    //         <div className="flex items-center gap-2 font-medium leading-none">
    //           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //         </div>
    //         <div className="flex items-center gap-2 leading-none text-muted-foreground">
    //           January - June 2024
    //         </div>
    //       </div>
    //     </div>
    //   </CardFooter> 
    // </Card>
  )
}
