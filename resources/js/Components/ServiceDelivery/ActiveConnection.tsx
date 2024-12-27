import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/ui/Card/Card'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, router } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import useFetchRecord from '@/hooks/useFetchRecord'
import ActiveConnectionTrend from './ActiveConnection/ActiveConnectionTrend'
import ActiveConncetionList from './ActiveConncetionList'
import DataShowIcon from '../ui/DatashowIcon'
import TrendIcon from '../ui/TrendIcon'
import Top10Icon from '../ui/Top10Icon'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '../CustomTooltip'

export interface InactiveGraphValues {
  conn_status_code: string
  total_consumers__count_: number
  data_date: string
  consumer_category: string
  voltage: string
  month: string
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

export const formatNumber = (value: number | null) => {
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

  const [selectedLevel, setSelectedLevel] = useState(1)
  const [voltageType, setVoltageType] = useState('Total')

  const [graphValues] = useFetchRecord<{ data: InactiveGraphValues[]; latest_value: string }>(
    `subset/198?${
      selectedMonth == null
        ? 'latest=month'
        : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
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
          value.consumer_category === category &&
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
    <Card className='flex flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl bg-1stop-alt-gray'>
          <button
            className={`flex w-full rounded-tl-2xl border border-white px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <DataShowIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <TrendIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <Top10Icon />
          </button>
          <div className='h-full border-r border-white bg-1stop-alt-gray md:min-h-40'></div>
        </div>
        {/* Data Section */}
        {selectedLevel === 1 && (
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
                    {graphValues?.data.length ? (
                      formatNumber(cunsumerCount('LT') ?? 0)
                    ) : (
                      <Skeleton />
                    )}
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
                    {graphValues?.data.length ? (
                      formatNumber(cunsumerCount('HT') ?? 0)
                    ) : (
                      <Skeleton />
                    )}
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
                  {graphValues?.data.length ? (
                    formatNumber(cunsumerCount('EHT') ?? 0)
                  ) : (
                    <Skeleton />
                  )}
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
        {selectedLevel === 2 && (
          <ActiveConnectionTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {selectedLevel === 3 && (
          <ActiveConncetionList
            column1='State'
            column2='Consumer count'
            subset_id='198'
            default_level='section'
            sortBy='total_consumers__count_'
            route={`/office-rankings/Active Connections?route=${route('service-delivery.index')}`}
          />
        )}
      </div>
      {/* //Footer */}
      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-alt-gray px-4 pl-12'>
        <div className='py-4'>
          <p className='md:mdmetric-1stop smmetric-1stop'>Active Connections</p>
        </div>
        <div className='small-1stop-header flex h-full w-1/4 flex-col items-center justify-center bg-1stop-accent2 bg-opacity-50'>
          <div style={{ opacity: 1 }}>
            <MonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
        <div className='flex items-center pl-2 hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Active Connections Summary?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
export default ActiveConnection
