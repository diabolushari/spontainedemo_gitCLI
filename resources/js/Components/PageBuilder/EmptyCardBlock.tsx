import React, { useMemo, useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { Block, BlockDimension } from '@/interfaces/data_interfaces'
import { BlockRadioGroup } from './BlockRadioGroup'
import TrendGraph from '@/Components/Dashboard/SampleDashboard/TrendGraph'
import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'

function dateToYearMonth(date?: Date | null) {
  if (!date) return ''
  return `${date.getFullYear()}${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`
}

export function EmptyCardBlock({
  block,
  dimensions,
}: {
  block?: Block
  dimensions?: Record<string, string>
}) {
  const [selectedView, setSelectedView] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date('2025-01-01'))
  const monthYear = useMemo(() => dateToYearMonth(selectedMonth), [selectedMonth])

  const classNames = useMemo(() => {
    const classes = Object.keys(block?.dimensions ?? {}).map((key) => {
      return block?.dimensions?.[key as keyof BlockDimension]
    })

    return classes.join(' ')
  }, [block])

  return (
    <div className={classNames}>
      <Card className='min-h-24 rounded-md'>
        <CardHeader title={block ? block.data?.title : 'Sample'} />
        <div className=''>{JSON.stringify(block?.data?.title)}</div>
        <BlockRadioGroup
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
        <div className='mt-4'>
          {selectedView === 'trend' && (
            <TrendGraph
              cardTitle='Consumer Trend'
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              subsetId={315}
              dataField='total_consumers__count_'
              dataFieldName='Consumer Count'
              chartType='area'
            />
          )}
          {selectedView === 'rank' && selectedMonth != null && (
            <RankedList
              subsetId={198}
              cardTitle='Ranked by Consumer Count'
              dataField='total_consumers__count_'
              dataFieldName='Consumer Count'
              rankingPageUrl={`/sample-ranking-page?month=${monthYear}&route=${route('service-delivery.index')}`}
              timePeriod={monthYear}
              timePeriodFieldName='month'
            />
          )}
        </div>
      </Card>
    </div>
  )
}
