import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  chart_content: any
}
const mockData = [
  { consumer_category: 'Domestic', total_demand: 1200000 },
  { consumer_category: 'Commercial', total_demand: 800000 },
  { consumer_category: 'Industrial', total_demand: 600000 },
  { consumer_category: 'Agriculture', total_demand: 300000 },
  { consumer_category: 'Public Lighting', total_demand: 100000 },
]
const keysToPlot = [
  {
    key: 'total_demand',
    label: 'Total Demand',
    unit: 'kWh',
  },
]
export default function OverviewChart({ selectedMonth, setSelectedMonth, chart_content }: Props) {
  const keysToPlot = chart_content?.y_axis?.map((axis) => ({
    key: axis.value,
    label: axis.label,
  }))
  const [data] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    `/subset/${chart_content.subset_id}?${
      selectedMonth == null
        ? 'latest=month'
        : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
  )

  const aggregatedData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return []

    // For pie chart: no aggregation needed
    if (chart_content.chart_type === 'pie') return data.data

    const grouped = new Map<string, any>()

    data.data.forEach((item) => {
      const category = item[chart_content.x_axis] as string
      if (!category) return

      if (!grouped.has(category)) {
        grouped.set(category, {
          [chart_content.x_axis]: category,
        })
      }

      keysToPlot?.forEach(({ key }) => {
        const prev = grouped.get(category)[key] || 0
        grouped.get(category)[key] = prev + (Number(item[key]) || 0)
      })
    })

    return Array.from(grouped.values())
  }, [data?.data, chart_content.x_axis, keysToPlot, chart_content.chart_type])

  return (
    <div className='flex w-full flex-col pr-4'>
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{chart_content.title}</span>
        </div>
      </div>
      {chart_content.chart_type === 'bar' && (
        <CustomBarChart
          data={aggregatedData}
          dataKey={chart_content.x_axis}
          keysToPlot={keysToPlot}
        />
      )}
      {chart_content.chart_type === 'line' && (
        <CustomLineChart
          data={aggregatedData}
          dataKey={chart_content.x_axis}
          keysToPlot={keysToPlot}
        />
      )}
      {chart_content.chart_type === 'pie' && keysToPlot?.length === 1 && (
        <>
          <CustomPieChart
            data={aggregatedData}
            dataKey={keysToPlot[0].key}
            nameKey={chart_content.x_axis}
            keysToPlot={keysToPlot}
          />
        </>
      )}
    </div>
  )
}
