import { useCallback, useEffect, useMemo, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { router } from '@inertiajs/react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '../CustomTooltip'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'

export interface NewConnectionGraphValues {
  compl_beyond_sla__: number
  compl_beyond_sla_cnt: number
  compl_within_sla__: number
  compl_within_sla_cnt: number
  month: string
  pend_beyond_sla__: number
  pend_beyond_sla_cnt: number
  pend_within_sla__: number
  pend_within_sla_cnt: number
  sla_perf__: number
  sla_perf_cnt: number
  sla_svc_group: string
}

interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

const NewConnections = () => {
  const [showPercentage, setshowPercentage] = useState<boolean>(false)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState('overview')

  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])

  const CustomLegend = ({ payload }: LegendProps) => {
    return (
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
        {payload.map(
          (
            entry: {
              value: string
              color: string
            },
            index: number
          ) => {
            // Add logic to include count when toggleValue is true
            const correspondingData = data.find((d) => d.name === entry.value)
            const count =
              showPercentage && correspondingData
                ? ` (${correspondingData.value})`
                : `(${correspondingData.value.toFixed(2)})%`

            return (
              <li
                key={`item-${index}`}
                style={{ marginRight: 10, color: 'black', fontSize: '8px', lineHeight: '10px' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    backgroundColor: entry.color,
                    marginRight: 5,
                    paddingTop: 1,
                  }}
                />
                <br />
                {entry.value}
                <br />
                {count}
              </li>
            )
          }
        )}
      </ul>
    )
  }

  const [graphValues] = useFetchRecord<{
    data: NewConnectionGraphValues[]
    latest_value: string
  }>(
    `subset/63?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const slaPerf = isLoading
    ? 0
    : showPercentage
      ? graphValues.data[0]?.sla_perf_cnt || 0
      : graphValues.data[0]?.sla_perf__ || 0
  const completedBeyondSla = isLoading
    ? 0
    : showPercentage
      ? graphValues.data[0]?.compl_beyond_sla_cnt || 0
      : graphValues.data[0]?.compl_beyond_sla__ || 0
  const completedWithinSla = isLoading
    ? 0
    : showPercentage
      ? graphValues.data[0]?.compl_within_sla_cnt || 0
      : graphValues.data[0]?.compl_within_sla__ || 0
  const pendingBeyondSla = isLoading
    ? 0
    : showPercentage
      ? graphValues.data[0]?.pend_beyond_sla_cnt || 0
      : graphValues.data[0]?.pend_beyond_sla__ || 0
  const pendingWithinSla = isLoading
    ? 0
    : showPercentage
      ? graphValues.data[0]?.pend_within_sla_cnt || 0
      : graphValues.data[0]?.pend_within_sla__ || 0

  //   const avgWithinSlaDays = isLoading ? 0 : graphValues[0]?.avg_within_sla_days || 0

  const data = [
    { name: 'Requests Completed Within SLA', value: completedWithinSla },
    { name: 'Requests Completed Beyond SLA', value: completedBeyondSla },
    { name: 'Requests Pending Within SLA', value: pendingWithinSla },
    { name: 'Requests Pending Beyond SLA', value: pendingBeyondSla },
  ]

  const handleToogleNumber = () => {
    setshowPercentage(!showPercentage)
  }

  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'SLA Compliance Analysis - New Connection Requests',
          subset: data.name,
          month: dateToYearMonth(selectedMonth),
          route: route('service-delivery.index'),
        })
      )
    },
    [selectedMonth]
  )

  return (
    <DashboardCardLayout
      title='New Connection Requests'
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      showPercentage={showPercentage}
      setShowPercentage={setshowPercentage}
      moreUrl={`/data-explorer/SLA Compliance Analysis - New Connection Requests?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col space-x-1 p-2 md:flex-row'>
          <div className='flex flex-col gap-1 pt-4 md:w-1/2'>
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {isLoading ? (
                  <Skeleton width='50%' />
                ) : showPercentage ? (
                  formatNumber(slaPerf)
                ) : (
                  `${slaPerf.toFixed(2)}%`
                )}
              </p>

              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Overall SLA compliant requests </p>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : showPercentage ? (
                    formatNumber(completedWithinSla)
                  ) : (
                    `${completedWithinSla.toFixed(2)}%`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Compl. within SLA </p>
                </div>
              </div>

              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : showPercentage ? (
                    formatNumber(pendingWithinSla)
                  ) : (
                    `${pendingWithinSla.toFixed(2)}%`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Pending within SLA </p>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : showPercentage ? (
                    formatNumber(completedBeyondSla)
                  ) : (
                    `${completedBeyondSla.toFixed(2)}%`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Compl. beyond SLA </p>
                </div>
              </div>
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : showPercentage ? (
                    formatNumber(pendingBeyondSla)
                  ) : (
                    `${pendingBeyondSla.toFixed(2)}%`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Pending beyond SLA </p>
                </div>
              </div>
            </div>
          </div>
          <div className='relative flex flex-col pt-2 md:w-1/2'>
            {isLoading ? (
              <Skeleton
                circle={true}
                height={200}
                width={200}
              />
            ) : (
              <ResponsiveContainer
                className='small-1stop'
                height={300}
              >
                <PieChart
                  width={100}
                  height={100}
                >
                  <Tooltip
                    content={<CustomTooltip valueType={showPercentage ? 'count' : 'percentage'} />}
                    formatter={(value: number) => (showPercentage ? value : `${value.toFixed(2)}%`)}
                  />

                  <Pie
                    data={data}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'
                    stroke='none'
                    onClick={handleGraphSelection}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={solidColors[index % solidColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend content={CustomLegend} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={90}
          cardTitle='Trend of Requests Breaching SLA'
          dataField='requests_breaching_sla__count_'
          dataFieldName='RequestsBreachingSla'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={63}
          cardTitle={
            showPercentage
              ? 'Ranked by Overall SLA Compliant Requests (%)'
              : 'Ranked by Overall SLA Compliant Requests (count)'
          }
          dataField={!showPercentage ? 'sla_perf_cnt' : 'sla_perf__'}
          dataFieldName={
            showPercentage
              ? 'Overall SLA Compliant Requests (%)'
              : 'Overall SLA Compliant Requests (count)'
          }
          rankingPageUrl={`office-rankings/SLA Compliance Analysis - New Connection Requests?latest=month&route=${route('service-delivery.index')}`}
          timePeriodFieldName='month'
          timePeriod={monthYear}
        />
      )}
    </DashboardCardLayout>
  )
}

export default NewConnections
