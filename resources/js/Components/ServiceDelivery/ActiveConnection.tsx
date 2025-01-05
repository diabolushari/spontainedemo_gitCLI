import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'
import useFetchRecord from '@/hooks/useFetchRecord'
import { solidColors } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CustomTooltip } from '../CustomTooltip'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'

export interface InactiveGraphValues {
  conn_status_code: string
  total_consumers__count_: number
  data_date: string
  voltage: string
  month: string
  tariff_category: string
}

// -----------Remove this section when done----------------
interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

export const CustomLegend = ({ payload }: LegendProps) => {
  // Calculate the total value of the dataset
  const totalValue = payload.reduce((sum, entry) => sum + entry.payload.value, 0)

  return (
    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
      {payload.map((entry, index) => {
        const percentage = ((entry.payload.value / totalValue) * 100).toFixed(2) // Calculate percentage
        return (
          <li
            key={`item-${index}`}
            style={{ marginRight: 10, color: 'black', fontSize: '8px', lineHeight: '10px' }}
            className='uppercase'
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
            {`${entry.value} (${percentage}%)`} {/* Append percentage */}
          </li>
        )
      })}
    </ul>
  )
}

export const formatNumber = (value?: number | null) => {
  if (value == null) {
    return
  }
  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + ' Cr'
  } else if (value >= 100000) {
    return (value / 100000).toFixed(2) + ' L'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + ' K'
  }
  return Number(value).toFixed(2).toString()
}

export function dateToYearMonth(date?: Date | null) {
  if (date == null) {
    return ''
  }
  return `${date.getFullYear()}${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`
}

export function yearMonthToDate(yearMonth?: string | null): Date | null {
  if (yearMonth == null) {
    return null
  }

  const year = Number(yearMonth) / 100
  const month = Number(yearMonth) % 100
  return new Date(Math.trunc(year), month - 1, 1)
}

const ActiveConnection = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [voltageType, setVoltageType] = useState('Total')

  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])

  const [graphValues] = useFetchRecord<{ data: InactiveGraphValues[]; latest_value: string }>(
    `/subset/314?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const cunsumerCount = (voltage: string) => {
    if (voltage != 'Total') {
      return graphValues?.data
        .filter((value) => value.voltage === voltage)
        .reduce((sum, value) => sum + value.total_consumers__count_, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.total_consumers__count_, 0)
    }
  }
  const graphFilter = (category: string) => {
    return graphValues?.data
      .filter(
        (value) =>
          value.tariff_category === category &&
          (voltageType === 'Total' || value.voltage === voltageType)
      )
      .reduce((sum, value) => sum + value.total_consumers__count_, 0)
  }

  const data = [
    {
      name: 'DOMESTIC',
      value: graphFilter('DOMESTIC'),
    },
    {
      name: 'INDUSTRIAL',
      value: graphFilter('INDUSTRIAL'),
    },
    {
      name: 'COMMERCIAL',
      value: graphFilter('COMMERCIAL'),
    },
    {
      name: 'AGRICULTURE',
      value: graphFilter('AGRICULTURE'),
    },
    {
      name: 'OTHER',
      value:
        cunsumerCount('Total') -
        graphFilter('DOMESTIC') -
        graphFilter('INDUSTRIAL') -
        graphFilter('COMMERCIAL') -
        graphFilter('AGRICULTURE'),
    },
  ]

  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      const excludedCategories = ['DOMESTIC', 'INDUSTRIAL', 'COMMERCIAL', 'AGRICULTURE']

      router.get(
        route('data-explorer', {
          subsetGroup: 'Active Connections Summary',
          voltage: voltageType === 'Total' ? '' : voltageType,
          month: dateToYearMonth(selectedMonth),
          consumer_category: data.name === 'OTHER' ? '' : data.name,
          consumer_category_not_in:
            data.name === 'OTHER'
              ? `${excludedCategories.filter((category) => category).join(',')}`
              : '',
        })
      )
    },
    [voltageType, selectedMonth]
  )

  return (
    <DashboardCardLayout
      title='Active Connections'
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Active Connections Summary?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
    >
      {/* Data Section */}
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col space-x-1 p-2 md:flex-row'>
          <div className='flex flex-col gap-1 pt-4 md:w-1/2'>
            {/* Total Connections */}
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {graphValues?.data.length ? (
                  formatNumber(cunsumerCount('Total') ?? 0)
                ) : (
                  <Skeleton />
                )}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total Active Connections</p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    type='radio'
                    name='radio'
                    checked={voltageType === 'Total'}
                    onClick={() => setVoltageType('Total')}
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues?.data.length ? formatNumber(cunsumerCount('LT') ?? 0) : <Skeleton />}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>LT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      onClick={() => setVoltageType('LT')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              {/* HT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues?.data.length ? formatNumber(cunsumerCount('HT') ?? 0) : <Skeleton />}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>HT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      onClick={() => setVoltageType('HT')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EHT */}
            <div className='flex flex-col border p-2'>
              <p className='mdmetric-1stop'>
                {graphValues?.data.length ? formatNumber(cunsumerCount('EHT') ?? 0) : <Skeleton />}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>EHT </p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    type='radio'
                    name='radio'
                    onClick={() => setVoltageType('EHT')}
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className='relative flex justify-center md:w-1/2'>
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
                    formatter={(value: number) => `${formatNumber(value)}`}
                    content={<CustomTooltip />}
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
            {/* <span className='subheader-sm-1stop absolute bottom-11'>CONNECTIONS BY CATEGORY</span> */}
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={315}
          cardTitle='Trend of Active Connections'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          dataField='total_consumers__count_'
          dataFieldName='Total Consumer Count'
          filterListFetchURL={route('static-list', { type: 'voltage' })}
          filterFieldName='voltage'
          filterListKey='value'
          defaultFilterValue='LT'
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={198}
          cardTitle='Ranked by Connection Counts'
          dataField='total_consumers__count_'
          dataFieldName='Consumer Count'
          rankingPageUrl={`/office-rankings/Active Connections?route=${route('service-delivery.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
        />
      )}
    </DashboardCardLayout>
  )
}
export default ActiveConnection
