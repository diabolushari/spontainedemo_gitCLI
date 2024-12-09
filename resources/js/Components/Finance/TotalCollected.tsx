import React, { useEffect, useState } from 'react'
import Card from '@/ui/Card/Card'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import { User } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import DataShowIcon from '../ui/DatashowIcon'
import TrendIcon from '../ui/TrendIcon'
import Top10Icon from '../ui/Top10Icon'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '../CustomTooltip'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import TotalCollectionList from './TotalCollectionList'
import TotalCollectionTrend from './TotalCollectionTrend'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
  user: User
}

export interface CollectionGraphValues {
  month: string
  payment_channel_group: string
  total_collection: string
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

export const CustomLegend = ({ payload }: LegendProps) => {
  // Calculate the total value of the dataset
  const totalValue = payload.reduce((sum, entry) => sum + entry.payload.value, 0)

  return (
    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
      {payload.map((entry, index) => {
        const percentage = ((entry.payload.value / totalValue) * 100).toFixed(2)
        return (
          <li
            key={`item-${index}`}
            style={{ marginRight: 10, color: 'black', fontSize: '8px' }}
            className='uppercase'
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 5,
              }}
            />
            {`${entry.value} (${percentage}%)`}
          </li>
        )
      })}
    </ul>
  )
}

const TotalCollected = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [toggleValue, settoggleValue] = useState<boolean>(true)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [voltageType, setVoltageType] = useState('Total')
  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const [graphValues] = useFetchRecord<{ data: CollectionGraphValues[]; latest_value: string }>(
    `subset/152?${
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

  const filters = (value: CollectionGraphValues, index: number) => {
    if (index < 3) {
      if (voltageType == 'Total') {
        return value.payment_channel_group === graphValues?.data[index].payment_channel_group
      } else {
        return (
          value.payment_channel_group === graphValues?.data[index].payment_channel_group &&
          value.voltage == voltageType
        )
      }
    } else {
      if (voltageType == 'Total') {
        return (
          value.payment_channel_group !== graphValues?.data[0]?.payment_channel_group &&
          value.payment_channel_group !== graphValues?.data[1]?.payment_channel_group &&
          value.payment_channel_group !== graphValues?.data[2]?.payment_channel_group
        )
      } else {
        return (
          value.payment_channel_group !== graphValues?.data[0]?.payment_channel_group &&
          value.payment_channel_group !== graphValues?.data[1]?.payment_channel_group &&
          value.payment_channel_group !== graphValues?.data[2]?.payment_channel_group &&
          value.voltage == voltageType
        )
      }
    }
  }

  const TotalCollection = (voltage: string) => {
    if (voltage != 'Total') {
      return graphValues?.data
        .filter((value) => value.voltage === voltage)
        .reduce((sum, value) => sum + value.total_collection, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.total_collection, 0)
    }
  }

  const graphFilter = (index: number) => {
    return graphValues?.data
      .filter((value) => filters(value, index))
      .reduce((sum, value) => sum + value.total_collection, 0)
  }

  const data = [
    {
      name: graphValues?.data[0]?.payment_channel_group,
      value: graphFilter(0),
    },
    {
      name: graphValues?.data[1]?.payment_channel_group,
      value: graphFilter(1),
    },
    {
      name: graphValues?.data[2]?.payment_channel_group,
      value: graphFilter(2),
    },
    {
      name: 'Other',
      value: graphFilter(3),
    },
  ]

  const ltPercent = TotalCollection('LT')
    ? (TotalCollection('LT') * 100) / TotalCollection('Total')
    : 0
  const htPercent = TotalCollection('HT')
    ? (TotalCollection('HT') * 100) / TotalCollection('Total')
    : 0
  const ehtPercent = TotalCollection('EHT')
    ? (TotalCollection('EHT') * 100) / TotalCollection('Total')
    : 0

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
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
          <button
            className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </button>
          <button
            className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </button>
        </div>
        {/* Data Section */}
        {selectedLevel === 1 && (
          <div className='flex w-full flex-row space-x-1 p-2'>
            <div className='flex w-1/2 flex-col gap-1 pt-4'>
              {/* Total Connections */}
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
                      type='radio'
                      name='radio'
                      checked={voltageType === 'Total'}
                      onClick={() => setVoltageType('Total')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 bg-1stop-alt-highlight checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              <div className='flex w-full flex-row space-x-1'>
                {/* LT */}
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
                        name='radio'
                        onClick={() => setVoltageType('HT')}
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
                      name='radio'
                      onClick={() => setVoltageType('EHT')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className='relative flex w-1/2 flex-col pt-2'>
              <div className='flex w-full justify-end'>
                <button
                  className='small-1stop mb-auto cursor-pointer justify-end'
                  onClick={handleToogleNumber}
                >
                  {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
                </button>
              </div>
              {isLoading ? (
                <Skeleton
                  circle={true}
                  height={200}
                  width={200}
                />
              ) : (
                <ResponsiveContainer className='small-1stop'>
                  <PieChart
                    width={100}
                    height={100}
                  >
                    <Tooltip
                      formatter={(value: number) => `${formatNumber(value.toFixed(2))}`}
                      content={<CustomTooltip />}
                    />

                    <Pie
                      data={data}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey='value'
                      stroke='none'
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
          <TotalCollectionTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {selectedLevel === 3 && (
          <TotalCollectionList
            column1='Section'
            column2='Collection'
            subset_id='152'
            default_level='section'
            sortBy='total_collection'
            route={`office-rankings/Collection Summary?route=${route('finance.index')}`}
          />
        )}
      </div>
      {/* //Footer */}
      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-alt-gray px-4 pl-12'>
        <div className='py-4'>
          <p className='mdmetric-1stop'>Collections</p>
        </div>
        <div
          className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 bg-opacity-50 px-4'
          //   style={{ backgroundBlendMode: 'overlay', opacity: 0.7 }}
        >
          <div style={{ opacity: 1 }}>
            <MonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Collection Summary?latest=month&route=${route('finance.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
export default TotalCollected
