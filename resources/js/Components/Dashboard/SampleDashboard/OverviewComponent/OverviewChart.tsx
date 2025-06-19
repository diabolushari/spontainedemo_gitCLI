import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import NormalText from '@/typography/NormalText'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  chart_content: any
}
const keysToPlot = [{ key: 'requests_completed_within_sla__count_', label: 'Requests completed' }]
export default function OverviewChart({ selectedMonth, setSelectedMonth, chart_content }: Props) {
  const [breachingSlaData] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(`/subset/${chart_content?.subset_id}`)
  console.log(breachingSlaData)
  return (
    <div className='flex w-full flex-col pr-4'>
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{chart_content.title}</span>
        </div>
        <NormalText>{chart_content.description}</NormalText>
      </div>
      {chart_content.chart_type === 'bar' && (
        <CustomBarChart
          data={breachingSlaData?.data}
          dataKey='month'
          keysToPlot={keysToPlot}
        />
      )}
    </div>
  )
}
