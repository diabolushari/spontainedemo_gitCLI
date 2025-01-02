import useFetchRecord from '@/hooks/useFetchRecord'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { router } from '@inertiajs/react'
import { dateToYearMonth, formatNumber } from '../ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'

export interface SlaPerformanceValues {
  month: string
  request_type: string
  requests_completed_beyond_sla____: number
  requests_completed_beyond_sla__count_: number
  requests_completed_within_sla____: number
  requests_completed_within_sla__count_: number
  requests_pending_beyond_sla____: number
  requests_pending_beyond_sla__count_: number
  requests_pending_within_sla____: number
  requests_pending_within_sla__count_: number
}

const SlaPerformance = () => {
  const [showPercentage, setshowPercentage] = useState<boolean>(false)
  const [categories, setCategories] = useState<{ sla_svc_group: string }[]>([])
  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])

  const [graphValues] = useFetchRecord<{
    data: SlaPerformanceValues[]
    latest_value: string
  }>(
    `/subset/128?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const groupedDataPercentage = Array.from(
    new Map(
      graphValues?.data.map(
        ({
          request_type,
          requests_completed_within_sla____,
          requests_completed_beyond_sla____,
          requests_pending_within_sla____,
          requests_pending_beyond_sla____,
        }) => [
          request_type,
          {
            name: request_type,
            requests_completed_within_sla____,
            requests_completed_beyond_sla____,
            requests_pending_within_sla____,
            requests_pending_beyond_sla____,
          },
        ]
      )
    ).values()
  )

  const groupedDataNumber = Array.from(
    new Map(
      graphValues?.data.map(
        ({
          request_type,
          requests_completed_within_sla__count_,
          requests_completed_beyond_sla__count_,
          requests_pending_within_sla__count_,
          requests_pending_beyond_sla__count_,
        }) => [
          request_type,
          {
            name: request_type,
            requests_completed_within_sla__count_,
            requests_completed_beyond_sla__count_,
            requests_pending_within_sla__count_,
            requests_pending_beyond_sla__count_,
          },
        ]
      )
    ).values()
  )

  const groupedData = showPercentage ? groupedDataNumber : groupedDataPercentage

  const CustomTick = (props) => {
    const { x, y, payload } = props
    const displayName =
      payload.value.length > 10 ? `${payload.value.slice(0, 9)}...` : payload.value

    return (
      <text
        x={x}
        y={y}
        dy={16}
        textAnchor='end'
        transform={`rotate(-45, ${x}, ${y})`}
        className='axial-label-1stop'
      >
        {displayName}
      </text>
    )
  }

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const handleToogleNumber = () => {
    setshowPercentage(!showPercentage)
  }
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
          <div className='small-1stop mb-2 font-bold'>{label}</div>
          <div>
            {payload.map((entry, index) => {
              const dataKey = entry.dataKey
                .replace(/_/g, ' ')
                .replace(
                  /\w\S*/g,
                  (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
                )

              return (
                <p
                  key={`tooltip-${index}`}
                  style={{ color: entry.color }}
                  className='small-1stop'
                >
                  {`${dataKey}:`}{' '}
                  <span className='small-1stop font-bold'>
                    {showPercentage
                      ? formatNumber(entry.value)
                      : `${Number(entry.value).toFixed(2)}%`}
                  </span>
                </p>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'SLA Performance Comparison',
          subset: 'SLA Performance Analysis - All Request Types',
          request_type: data.name,
          month: dateToYearMonth(selectedMonth),
          route: route('service-delivery.index'),
        })
      )
    },
    [selectedMonth]
  )

  return (
    <DashboardCardLayout
      title='SLA Performance by Request Type'
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      showPercentage={showPercentage}
      setShowPercentage={setshowPercentage}
      moreUrl={`/data-explorer/SLA Performance Comparison?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-row space-x-1 p-2 pt-4'>
          <div className='w-full rounded-lg bg-white'>
            <div>
              {isLoading ? (
                <Skeleton
                  height={200}
                  width='100%'
                />
              ) : (
                <div className='flex w-full flex-col items-end'>
                  <ResponsiveContainer
                    width='100%'
                    height={280}
                  >
                    <BarChart
                      data={groupedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barSize={40}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='name'
                        tick={<CustomTick />}
                        height={80}
                        interval={0}
                      />
                      <YAxis hide />
                      {/* <Tooltip
                          formatter={(value: number) =>
                            toggleValue ? formatNumber(value) : `${value.toFixed(2)}%`
                          }
                        /> */}

                      <Tooltip content={renderCustomTooltip} />
                      <Bar
                        dataKey={
                          showPercentage
                            ? 'requests_completed_within_sla__count_'
                            : 'requests_completed_within_sla____'
                        }
                        stackId='a'
                        fill={solidColors[6]}
                        onClick={handleGraphSelection}
                      />

                      <Bar
                        dataKey={
                          showPercentage
                            ? 'requests_pending_within_sla__count_'
                            : 'requests_pending_within_sla____'
                        }
                        stackId='a'
                        fill={solidColors[0]}
                        onClick={handleGraphSelection}
                      />
                      <Bar
                        dataKey={
                          showPercentage
                            ? 'requests_completed_beyond_sla__count_'
                            : 'requests_completed_beyond_sla____'
                        }
                        stackId='a'
                        fill={solidColors[7]}
                        onClick={handleGraphSelection}
                      />
                      <Bar
                        dataKey={
                          showPercentage
                            ? 'requests_pending_beyond_sla__count_'
                            : 'requests_pending_beyond_sla____'
                        }
                        stackId='a'
                        fill={solidColors[5]}
                        onClick={handleGraphSelection}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={78}
          cardTitle='Trend of SLA Performance'
          dataField='sla_perf_perc'
          dataFieldName='SLA Performance (%)'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          filterListFetchURL={`/subset/78?month=${monthYear}`}
          filterListKey={'sla_svc_group'}
          filterFieldName={'request_type'}
          defaultFilterValue={'Ownership change'}
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          cardTitle={`${showPercentage ? 'Requests within SLA count' : 'Ranked by Requests Within SLA (%)'}`}
          subsetId={82}
          timePeriod={monthYear}
          timePeriodFieldName='month'
          dataField={showPercentage ? 'requests_within_sla__count_' : 'requests_within_sla____'}
          dataFieldName={showPercentage ? 'Requests within SLA count' : 'Request within SLA (%)'}
          rankingPageUrl={`office-rankings/SLA Performance Analysis?route=${route('service-delivery.index')}`}
          defaultFilterValue={'Ownership change'}
          filterListFetchURL={`/subset/78?month=${monthYear}`}
          filterListKey={'sla_svc_group'}
          filterFieldName={'request_type'}
        />
      )}
    </DashboardCardLayout>
  )
}

export default SlaPerformance
