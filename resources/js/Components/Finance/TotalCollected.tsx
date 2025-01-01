import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/ui/Card/Card'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, router } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import { User } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import DataShowIcon from '../ui/DatashowIcon'
import TrendIcon from '../ui/TrendIcon'
import Top10Icon from '../ui/Top10Icon'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '../CustomTooltip'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import TotalCollectionList from './TotalCollectionList'
import TotalCollectionTrend from './TotalCollectionTrend'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import { CustomLegend } from '../Financial/TotalBilled/TotalBilled'
import DashboardCardLayout from '../Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardTrendGraph from '../Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '../Dashboard/DashbaordCard/DashboardRankedList'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
  user: User
}

export interface CollectionGraphValues {
  month: string
  payment_channel_group: string
  total_collection: number
  voltage: string
}

interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

const TotalCollected = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [toggleValue, settoggleValue] = useState<boolean>(true)
  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [voltageType, setVoltageType] = useState('Total')
  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const [graphValues] = useFetchRecord<{ data: CollectionGraphValues[]; latest_value: string }>(
    `subset/225?${
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

  // const filters = (value: CollectionGraphValues, index: number) => {
  //   if (index < 3) {
  //     if (voltageType == 'Total') {
  //       return value.payment_channel_group === graphData[index]?.payment_channel_group
  //     } else {
  //       return (
  //         value.payment_channel_group === graphData[index]?.payment_channel_group &&
  //         value.voltage == voltageType
  //       )
  //     }
  //   } else {
  //     if (voltageType == 'Total') {
  //       return (
  //         value.payment_channel_group !== graphData[0]?.payment_channel_group &&
  //         value.payment_channel_group !== graphData[1]?.payment_channel_group &&
  //         value.payment_channel_group !== graphData[2]?.payment_channel_group
  //       )
  //     } else {
  //       return (
  //         value.payment_channel_group !== graphData[0]?.payment_channel_group &&
  //         value.payment_channel_group !== graphData[1]?.payment_channel_group &&
  //         value.payment_channel_group !== graphData[2]?.payment_channel_group &&
  //         value.voltage == voltageType
  //       )
  //     }
  //   }
  // }

  const TotalCollection = (voltage: string) => {
    if (voltage != 'Total') {
      return graphValues?.data
        .filter((value) => value.voltage === voltage)
        .reduce((sum, value) => sum + value.total_collection, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.total_collection, 0)
    }
  }

  // const graphFilter = (index: number) => {
  //   return graphData
  //     .filter((value) => filters(value, index))
  //     .reduce((sum, value) => sum + value.total_collection, 0)
  // }

  const findValue = (status: string) => {
    if (voltageType === 'Total') {
      return graphValues?.data
        .filter((value) => value.payment_channel_group === status)
        .reduce((sum, value) => sum + value.total_collection, 0)
    } else {
      return graphValues?.data
        .filter((value) => value.payment_channel_group === status && value.voltage === voltageType)
        .reduce((sum, value) => sum + value.total_collection, 0)
    }
  }

  const data = [
    {
      name: 'ONLINE',
      value: findValue('Online'),
    },
    {
      name: 'OFFLINE',
      value: findValue('Offline'),
    },
  ]
  const totalCount = findValue('Online') + findValue('Offline')

  const ltPercent = TotalCollection('LT')
    ? (TotalCollection('LT') * 100) / TotalCollection('Total')
    : 0
  const htPercent = TotalCollection('HT')
    ? (TotalCollection('HT') * 100) / TotalCollection('Total')
    : 0
  const ehtPercent = TotalCollection('EHT')
    ? (TotalCollection('EHT') * 100) / TotalCollection('Total')
    : 0
  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Collection Summary',
          voltage: voltageType === 'Total' ? '' : voltageType,
          month: dateToYearMonth(selectedMonth),
          payment_channel: data.name === 'Other' ? '' : data.name,
          route: route('finance.index'),
        })
      )
    },
    [voltageType, selectedMonth]
  )

  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])
  return (
    <DashboardCardLayout
      title='Collections'
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Collection Summary?month=${dateToYearMonth(selectedMonth)}&route=${route('finance.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col space-x-1 p-2 md:flex-row'>
          <div className='flex w-full justify-end md:hidden'>
            <button
              className='small-1stop mb-auto cursor-pointer justify-end'
              onClick={handleToogleNumber}
            >
              {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
            </button>
          </div>
          <div className='flex flex-col gap-1 pt-4 md:w-1/2'>
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {graphValues?.data.length ? (
                  formatNumber(TotalCollection('Total') ?? 0)
                ) : (
                  <Skeleton />
                )}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total Collection</p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    defaultChecked
                    type='radio'
                    name='radioCollected'
                    value='Total'
                    checked={voltageType === 'Total'}
                    onChange={() => setVoltageType('Total')}
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues?.data.length ? (
                    toggleValue ? (
                      formatNumber(TotalCollection('LT') ?? 0)
                    ) : (
                      ltPercent.toFixed(2) + '%'
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>LT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioCollected'
                      value='LT'
                      onChange={() => setVoltageType('LT')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues?.data.length ? (
                    toggleValue ? (
                      formatNumber(TotalCollection('HT') ?? 0)
                    ) : (
                      htPercent.toFixed(2) + '%'
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>HT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioCollected'
                      value='HT'
                      onChange={() => setVoltageType('HT')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col border p-2'>
              <p className='mdmetric-1stop'>
                {graphValues?.data.length ? (
                  toggleValue ? (
                    formatNumber(TotalCollection('EHT') ?? 0)
                  ) : (
                    ehtPercent.toFixed(2) + '%'
                  )
                ) : (
                  <Skeleton />
                )}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>EHT </p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    type='radio'
                    name='radioCollected'
                    value='EHT'
                    onChange={() => setVoltageType('EHT')}
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col pt-2 md:w-1/2'>
            <div className='hidden w-full justify-end md:flex'>
              <button
                className='small-1stop mb-auto cursor-pointer justify-end'
                onClick={handleToogleNumber}
              >
                {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            </div>
            {graphValues?.data.length ? (
              <ResponsiveContainer
                className='small-1stop'
                height={300}
              >
                <PieChart
                  width={100}
                  height={100}
                >
                  <Tooltip
                    formatter={(value: number) => `${formatNumber(Number(value.toFixed(2)))}`}
                    content={
                      <CustomTooltip
                        valueType={toggleValue ? 'count' : 'percentage'}
                        totalCount={totalCount}
                        isPercent
                      />
                    }
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
            ) : (
              <Skeleton
                circle={true}
                height={200}
                width={200}
              />
            )}
          </div>
        </div>
      )}{' '}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={225}
          cardTitle='Trend of Collections'
          selectedMonth={selectedMonth}
          dataField='total_collection'
          dataFieldName='Total Collection'
          filterListFetchURL={route('static-list', { type: 'voltage' })}
          filterFieldName='voltage'
          filterListKey='value'
          defaultFilterValue='LT'
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={225}
          cardTitle='Ranked by Total Collection'
          dataField='total_collection'
          dataFieldName='Collection'
          rankingPageUrl={`office-rankings/Collection Analysis?route=${route('finance.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
        />
      )}
    </DashboardCardLayout>
  )
}
export default TotalCollected
