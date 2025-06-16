import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'
import TrendGraph from '@/Components/Dashboard/SampleDashboard/TrendGraph'
import { Block, BlockDimension } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { useMemo, useState } from 'react'
import { BlockRadioGroup } from './BlockRadioGroup'
import MonthPicker from '@/ui/form/MonthPicker'
import MoreButton from '../MoreButton'

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
  console.log(block)
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
          {selectedView === 'trend' && block?.data?.trend?.subset_id && (
            <TrendGraph
              cardTitle={block.data.title}
              dataKey={block.data.trend.data_field.x_axis.value}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              subsetId={block.data.trend.subset_id}
              dataField={block.data.trend.data_field.y_axis.value}
              dataFieldName={block.data.trend.data_field.y_axis.label}
              xAxisLabel={
                block.data.trend.data_field.x_axis.show_label
                  ? block.data.trend.data_field.x_axis.label
                  : ''
              }
              yAxisLabel={
                block.data.trend.data_field.y_axis.show_label
                  ? block.data.trend.data_field.y_axis.label
                  : ''
              }
              chartType='area'
              tooltipIndicator={block.data.trend.tooltip_field}
            />
          )}
          {selectedView === 'rank' && selectedMonth != null && block?.data?.ranking?.subset_id && (
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
        <div
          className={`mt-auto flex min-h-[4.2rem] flex-shrink-0 items-center gap-4 justify-self-start rounded-b-2xl bg-1stop-alt-gray px-4 pl-12`}
        >
          {selectedMonth != null && setSelectedMonth != null && (
            <div className='small-1stop-header w-1/ flex h-full bg-1stop-accent2 bg-opacity-50'>
              <div
                style={{ opacity: 1 }}
                className='flex h-full flex-col items-center justify-center gap-2'
              >
                <MonthPicker
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              </div>
            </div>
          )}
          <div className='flex items-center pl-2 hover:cursor-pointer hover:opacity-50'>
            <MoreButton />
          </div>
        </div>
      </Card>
    </div>
  )
}
