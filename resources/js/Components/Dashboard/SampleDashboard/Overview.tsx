import React, { useEffect, useMemo, useState } from 'react'
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

  const [toggleValue, setToggleValue] = useState(true) // true = number, false = percentage
  const [selectedValue, setSelectedValue] = useState('') // current selected dimension value
  const [graphValues, setGraphValues] = useState<any>({ data: [] }) // fake default
  console.log(content)
  // Simulated data fetch (replace with real one)
  useEffect(() => {
    if (content?.graph_data) {
      setGraphValues(content.graph_data)
    }
  }, [content])

  return (
    <div className='flex w-full flex-col pr-4'>
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{content?.title}</span>
        </div>
        <NormalText>{content?.description}</NormalText>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* Chart Section */}
        <div
          className={`${
            overview_table ? 'col-span-1' : 'col-span-2'
          } rounded-md border border-gray-200`}
        >
          {overview_chart && (
            <OverviewChart
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              chart_content={overview_chart}
            />
          )}
        </div>

        {/* Grid Section */}
        <div
          className={`${
            overview_chart ? 'col-span-1' : 'col-span-2'
          } rounded-md border border-gray-200`}
        >
          {overview_table && (
            <OverviewGrid
              config={overview_table}
              data={graphValues.data}
              toggleValue={toggleValue}
              selected={selectedValue}
              onSelect={setSelectedValue}
            />
          )}
        </div>
      </div>
    </div>
  )
}
