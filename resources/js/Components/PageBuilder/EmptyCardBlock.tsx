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
        <CardHeader title={block?.name ?? ''} />
        <BlockRadioGroup
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          block={block}
        />
        <div className='mt-4'>
          {selectedView === 'trend' && block?.data?.trend && (
            <TrendGraph
              cardTitle={block.data.trend.title}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              subsetId={block.data?.trend.subset_id}
              dataField={block.data.trend.data_field.y_axis.value}
              dataFieldName={block.data.trend.data_field.y_axis.label}
              chartType='area'
            />
          )}
          {selectedView === 'rank' && selectedMonth != null && block?.data?.ranking && (
            <RankedList
              subsetId={block.data.ranking.subset_id}
              cardTitle={block.data.ranking.title}
              dataField={block.data.ranking.data_field.value}
              dataFieldName={block.data.ranking.data_field.label}
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
