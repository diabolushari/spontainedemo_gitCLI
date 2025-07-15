import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import React, { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import FontSizeSelector, {
  Size,
} from '@/Components/Dashboard/SampleDashboard/OverviewComponent/FontSizeSelector'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  chart_content: any
}

export default function OverviewChart({ selectedMonth, setSelectedMonth, chart_content }: Props) {
  const [fontClasses, setFontClasses] = useState('text-base')

  const keysToPlot = useMemo(() => {
    if (!chart_content?.y_axis) return []

    return chart_content.y_axis.map((axis: any) => {
      const formatLabel = (str: string) =>
        str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

      if (typeof axis === 'string') {
        return { key: axis, label: formatLabel(axis) }
      }

      return {
        key: axis.value,
        label: axis.label ?? formatLabel(axis.value),
        unit: axis.unit,
      }
    })
  }, [chart_content?.y_axis])

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    `/subset/${chart_content.subset_id}?${
      selectedMonth == null
        ? 'latest=month'
        : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
  )

  const aggregatedData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data) || !keysToPlot || keysToPlot.length === 0) {
      return []
    }

    const grouped = new Map<string, any>()

    data.data.forEach((item) => {
      const category = item[chart_content.x_axis] as string
      if (category === undefined || category === null) return

      if (!grouped.has(category)) {
        grouped.set(category, {
          [chart_content.x_axis]: category,
        })
      }

      const group = grouped.get(category)
      keysToPlot.forEach(({ key }) => {
        const prevValue = group[key] || 0
        group[key] = prevValue + (Number(item[key]) || 0)
      })
    })

    return Array.from(grouped.values())
  }, [data?.data, chart_content.x_axis, keysToPlot])

  const handleSizeChange = (newSize: Size) => {
    const sizeMap: Record<Size, string> = {
      SMALL: 'text-sm',
      MEDIUM: 'text-base',
      LARGE: 'text-lg',
    }
    setFontClasses(sizeMap[newSize])
  }

  return (
    <div className={`flex w-full flex-col pr-4 ${fontClasses}`}>
      <FontSizeSelector onSizeChange={handleSizeChange} />
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <div>{chart_content.title}</div>
        </div>
      </div>
      {loading && <Skeleton height={200} />}
      {chart_content.chart_type === 'bar' && !loading && (
        <CustomBarChart
          data={aggregatedData}
          dataKey={chart_content.x_axis}
          keysToPlot={keysToPlot}
          colors={chart_content.color_scheme}
          fontSize={fontClasses}
          sliceCount={chart_content.x_axis_count}
          sortOrder={chart_content.x_axis_order}
        />
      )}
      {chart_content.chart_type === 'line' && !loading && (
        <CustomLineChart
          data={aggregatedData}
          dataKey={chart_content.x_axis}
          displayKey={chart_content.x_axis_label}
          displayKeyShow={chart_content.x_axis_enable}
          keysToPlot={keysToPlot}
          colors={chart_content.color_scheme}
          fontSize={fontClasses}
          sliceCount={chart_content.x_axis_count}
          sortOrder={chart_content.x_axis_order}
        />
      )}
      {chart_content.chart_type === 'pie' && keysToPlot?.length > 0 && !loading && (
        <CustomPieChart
          data={aggregatedData}
          dataKey={keysToPlot[0].key}
          nameKey={chart_content.x_axis}
          keysToPlot={keysToPlot}
          colors={chart_content.color_scheme}
          fontSize={fontClasses}
          sliceCount={chart_content.x_axis_count}
          sortOrder={chart_content.x_axis_order}
        />
      )}
    </div>
  )
}
