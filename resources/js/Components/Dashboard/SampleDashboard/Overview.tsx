import NormalText from '@/typography/NormalText'
import React, { useEffect, useMemo, useState } from 'react'
import OverviewChart from './OverviewComponent/OverviewChart'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: any
}

export default function Overview({ selectedMonth, setSelectedMonth, content }: Props) {
  const isChartDefault = content.overview_chart?.default === true
  const isGridDefault = content.overview_grid?.default === true

  const FirstComponent = isChartDefault ? 'chart' : isGridDefault ? 'grid' : null

  return (
    <div className='flex w-full flex-col pr-4'>
      <div>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{content.title}</span>
        </div>
        <NormalText>{content.description}</NormalText>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* First: default one */}
        {FirstComponent === 'chart' && content.overview_chart && (
          <div
            className={`${
              content.overview_grid ? 'col-span-1' : 'col-span-2'
            } rounded-md border border-gray-200 p-4`}
          >
            <OverviewChart
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              chart_content={content.overview_chart}
            />
          </div>
        )}

        {FirstComponent === 'grid' && content.overview_grid && (
          <div
            className={`${
              content.overview_chart ? 'col-span-1' : 'col-span-2'
            } rounded-md border border-gray-200 p-4`}
          >
            Here the overview grid
          </div>
        )}

        {FirstComponent !== 'chart' && content.overview_chart && (
          <div className={content.overview_grid ? 'col-span-1' : 'col-span-2'}>
            <OverviewChart
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              chart_content={content.overview_chart}
            />
          </div>
        )}
        {FirstComponent !== 'grid' && content.overview_grid && (
          <div className={content.overview_chart ? 'col-span-1' : 'col-span-2'}>
            Here the overview grid
          </div>
        )}
      </div>
    </div>
  )
}
