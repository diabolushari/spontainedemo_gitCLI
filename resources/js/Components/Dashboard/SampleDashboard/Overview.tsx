import React, { useEffect, useState } from 'react'
import NormalText from '@/typography/NormalText'
import OverviewChart from './OverviewComponent/OverviewChart'
import OverviewGrid from './OverviewComponent/OverviewGrid'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: any
}

export default function Overview({ selectedMonth, setSelectedMonth, content }: Props) {
  const overview_table = content?.overview_table
  const overview_chart = content?.overview_chart

  const [toggleValue, setToggleValue] = useState(true)
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <div className='flex w-full flex-col pr-4'>
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{content?.title}</span>
        </div>
        <NormalText>{content?.description}</NormalText>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div
          className={`${
            overview_chart?.subset_id ? 'col-span-1' : 'col-span-2'
          } rounded-md border border-gray-200`}
        >
          {overview_table?.subset_id && (
            <OverviewGrid
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              config={overview_table}
              toggleValue={toggleValue}
              selected={selectedValue}
              onSelect={setSelectedValue}
            />
          )}
        </div>
        <div
          className={`${
            overview_table?.subset_id ? 'col-span-1' : 'col-span-2'
          } rounded-md border border-gray-200`}
        >
          {overview_chart?.subset_id && (
            <OverviewChart
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              chart_content={overview_chart}
            />
          )}
        </div>
      </div>
    </div>
  )
}
