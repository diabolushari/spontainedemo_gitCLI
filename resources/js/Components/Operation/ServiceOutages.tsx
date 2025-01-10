import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardCardLayout from '../Dashboard/DashbaordCard/DashboardCardLayout'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { Cell, Legend, LegendProps, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CustomTooltip } from '../CustomTooltip'
import Skeleton from 'react-loading-skeleton'
import useFetchRecord from '@/hooks/useFetchRecord'
import { solidColors } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import DashboardTrendGraph from '../Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '../Dashboard/DashbaordCard/DashboardRankedList'

interface ServiceOutagesValues {
  month: string
  scheduled_outages: number
  unscheduled_outages: number
  total_outages: number
}

const ServiceOutages = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [graphValues] = useFetchRecord<{
    data: ServiceOutagesValues[]
    latest_value: string
  }>(
    `subset/342?${selectedMonth == null ? 'latest=month' : `month=${dateToYearMonth(selectedMonth)}`}`
  )
  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const totalOutages = graphValues?.data.reduce((sum, record) => sum + record.total_outages, 0)
  const scheduledOutages = graphValues?.data.reduce(
    (sum, record) => sum + record.scheduled_outages,
    0
  )
  const unscheduledOutages = graphValues?.data.reduce(
    (sum, record) => sum + record.unscheduled_outages,
    0
  )
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0
  const data = [
    { name: 'Scheduled outages', value: scheduledOutages },
    { name: 'Unscheduled outages', value: unscheduledOutages },
  ]

  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Service Outages',
          subset:
            data.name == 'Scheduled outages'
              ? 'Scheduled Outages - Aggregate'
              : 'Unscheduled Outages - Aggregate',
          month: dateToYearMonth(selectedMonth),
          route: route('operation.index'),
        })
      )
    },
    [selectedMonth]
  )
  const CustomLegend = ({
    payload,
    data,
  }: LegendProps & { data: { name: string; value: number }[] }) => {
    if (!payload || payload.length === 0) return null
    const totalValue = data.reduce((sum, item) => sum + item.value, 0)
    return (
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
        {payload.map((entry, index) => {
          const correspondingData = data.find((d) => d.name === entry.value)
          const percentage = correspondingData
            ? ` (${((correspondingData.value / totalValue) * 100).toFixed(1)}%)`
            : ' (0%)'

          return (
            <li
              key={`item-${index}`}
              style={{
                marginRight: 10,
                color: 'black',
                fontSize: '10px',
                lineHeight: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 5,
                }}
              />
              {entry.value} {percentage}
            </li>
          )
        })}
      </ul>
    )
  }

  const availableRankingFields = [
    {
      subset_field_name: 'Scheduled Outage',
      subset_column: 'scheduled_outages',
    },
    {
      subset_field_name: 'Unscheduled Outages',
      subset_column: 'unscheduled_outages',
    },
  ]
  return (
    <DashboardCardLayout
      title='Service Outage'
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      moreUrl={`/data-explorer/Service Outages?month=${dateToYearMonth(selectedMonth)}&route=${route('operation.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col space-x-1 p-2 md:flex-row'>
          <div className='flex flex-col gap-1 pt-4 md:w-1/2'>
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {isLoading ? <Skeleton width='50%' /> : `${formatNumber(totalOutages)}`}
              </p>

              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>TOTAL OUTAGES </p>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? <Skeleton width='25%' /> : `${formatNumber(scheduledOutages)}`}
                </p>
                <div className='flex flex-col justify-between'>
                  <p className='small-1stop-header'>Scheduled outages</p>
                  <div
                    style={{ backgroundColor: solidColors[0] }}
                    className='h-2 w-full rounded text-white'
                  ></div>
                </div>
              </div>

              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {isLoading ? <Skeleton width='25%' /> : `${formatNumber(unscheduledOutages)}`}
                </p>
                <div className='flex flex-col justify-between'>
                  <p className='small-1stop-header'>Unscheduled outages </p>
                  <div
                    style={{ backgroundColor: solidColors[1] }}
                    className='h-2 w-full rounded text-white'
                  ></div>
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
                  <Tooltip content={<CustomTooltip />} />
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
                  <Legend
                    content={(props) => (
                      <CustomLegend
                        {...props}
                        data={data}
                      />
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={343}
          cardTitle='Trend Of Total Outage '
          dataField='total_outages'
          dataFieldName='Total Outage'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={342}
          cardTitle='Ranked by  Outage'
          dataField='scheduled_outages'
          dataFieldName='Scheduled outages'
          rankingPageUrl={`/office-rankings/Service Outage Analysis?month=${monthYear}&route=${route('service-delivery.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
          availableFields={availableRankingFields}
        />
      )}
    </DashboardCardLayout>
  )
}
export default ServiceOutages
