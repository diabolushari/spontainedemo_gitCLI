import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'
import TrendGraph from '@/Components/Dashboard/SampleDashboard/TrendGraph'
import { Block, BlockDimension } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { useEffect, useMemo, useState } from 'react'
import { BlockRadioGroup } from './BlockRadioGroup'
import MonthPicker from '@/ui/form/MonthPicker'
import MoreButton from '../MoreButton'
import useFetchRecord from '@/hooks/useFetchRecord'
import Overview from '../Dashboard/SampleDashboard/Overview'

function parseMonthYearString(monthYear: string): Date | null {
  if (!monthYear || monthYear.length !== 6) return null
  const year = parseInt(monthYear.slice(0, 4), 10)
  const month = parseInt(monthYear.slice(4), 10) - 1
  return new Date(year, month, 1)
}

// Convert Date → "YYYYMM"
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
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [date] = useFetchRecord(
    block?.data?.data_table_id ? route('data-detail.date', block.data.data_table_id) : ''
  )

  useEffect(() => {
    if (date?.max_value) {
      const parsed = parseMonthYearString(date.max_value)
      if (parsed) {
        setSelectedMonth(parsed)
      }
    }
  }, [date])

  const monthYear = useMemo(() => dateToYearMonth(selectedMonth), [selectedMonth])

  const classNames = useMemo(() => {
    const classes = Object.keys(block?.dimensions ?? {}).map((key) => {
      return block?.dimensions?.[key as keyof BlockDimension]
    })

    return classes.join(' ')
  }, [block])
  const sampleOverviewContent = {
    title: 'Test',
    description: 'This is a test',
    overview_chart: {
      default: true,
      subset_id: 120,
      title: 'chart',
      chart_type: 'bar',
    },
    overview_grid: {
      default: false,
      grid: true,
    },
  }
  return (
    <div className={classNames}>
      <Card className='min-h-18 rounded-md'>
        <CardHeader
          title={block?.data?.title ?? ''}
          subheading={block?.data?.description ?? ''}
        />
        <BlockRadioGroup
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          block={block}
        />

        <div className='flex flex-col justify-center md:min-h-[400px]'>
          {selectedView === 'overview' && block?.data && selectedMonth && (
            <Overview
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              content={sampleOverviewContent}
            />
          )}

          {/* === Trend Graph === */}
          {selectedView === 'trend' && block?.data?.trend?.subset_id && selectedMonth && (
            <TrendGraph
              cardTitle={block.data.trend.title}
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
              dimensions={block.dimensions}
            />
          )}

          {/* === Ranked List === */}
          {selectedView === 'rank' && selectedMonth && block?.data?.ranking?.subset_id && (
            <RankedList
              subsetId={block.data.ranking.subset_id}
              cardTitle={block.data.ranking.title}
              dataField={block.data.ranking.data_field.value}
              dataFieldName={
                block.data.ranking.data_field.show_label ? block.data.ranking.data_field.label : ''
              }
              rankingPageUrl={`/sample-ranking-page?month=${monthYear}&route=${route('service-delivery.index')}`}
              timePeriod={monthYear}
              timePeriodFieldName='month'
            />
          )}
        </div>
        {block?.data?.data_table_id && (
          <div className='mt-auto flex flex-shrink-0 items-center gap-4 justify-self-start rounded-b-2xl bg-1stop-alt-gray px-4 pl-12'>
            {selectedMonth != null && (
              <div className='small-1stop-header flex h-full bg-1stop-accent2 bg-opacity-50'>
                <div className='flex h-full flex-col items-center justify-center gap-2'>
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
        )}
      </Card>
    </div>
  )
}
