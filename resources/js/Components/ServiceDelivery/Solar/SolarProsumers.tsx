import React, { useEffect, useMemo, useState } from 'react'
import { CustomLegend, formatNumber } from '../ActiveConnection'
import { OfficeInfo } from '@/interfaces/dashboard_accordion'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '@/Components/CustomTooltip'

interface SolarProsumersValue {
  consumer_count: number
  month_year: string
  consumer_category: string
  voltage: string
  capacity_kw: number
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const SolarProsumers = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [voltageType, setVoltageType] = useState('Total')
  const [isMW, setiSMW] = useState(true)
  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>(route('find-level'))
  const [graphValues] = useFetchRecord<{ data: SolarProsumersValue[]; latest_value: string }>(
    `subset/71?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  // graphValues?.data.sort((a, b) => a.consumer_count - b.consumer_count).reverse()
  const graphData = useMemo(() => {
    if (graphValues?.data == null) {
      return []
    }
    return [...graphValues.data]
      .sort((a, b) => a.consumer_count - b.consumer_count)
      .filter((value) => voltageType == 'Total' || value.voltage == voltageType)
      .reverse()
  }, [graphValues, voltageType])
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const filters = (value: SolarProsumersValue, index: number) => {
    if (index < 3) {
      if (voltageType == 'Total') {
        return value.consumer_category === graphData[index].consumer_category
      } else {
        return (
          value.consumer_category === graphData[index].consumer_category &&
          value.voltage == voltageType
        )
      }
    } else {
      if (voltageType == 'Total') {
        return (
          value.consumer_category !== graphData[0]?.consumer_category &&
          value.consumer_category !== graphData[1]?.consumer_category &&
          value.consumer_category !== graphData[2]?.consumer_category
        )
      } else {
        return (
          value.consumer_category !== graphData[0]?.consumer_category &&
          value.consumer_category !== graphData[1]?.consumer_category &&
          value.consumer_category !== graphData[2]?.consumer_category &&
          value.voltage == voltageType
        )
      }
    }
  }

  const MWCount = (voltage: string, isCount: boolean) => {
    if (!isCount) {
      if (voltage != 'Total') {
        return graphValues?.data
          .filter((value) => value.voltage == voltage)
          .reduce((sum, value) => sum + value.capacity_kw, 0)
      } else {
        return graphValues?.data.reduce((sum, value) => sum + value.capacity_kw, 0)
      }
    } else {
      return graphValues?.data
        .filter((value) => value.voltage == voltage)
        .reduce((sum, value) => sum + value.consumer_count, 0)
    }
  }

  const graphFilter = (index: number) => {
    if (!isMW) {
      return graphData
        .filter((value) => filters(value, index))
        .reduce((sum, value) => sum + value.consumer_count, 0)
    } else {
      const count =
        graphData
          .filter((value) => filters(value, index))
          .reduce((sum, value) => sum + value.capacity_kw, 0) ?? 0
      return count / 1000
    }
  }

  const data = [
    {
      name: graphData[0]?.consumer_category,
      value: graphFilter(0),
    },
    {
      name: graphData[1]?.consumer_category,
      value: graphFilter(1),
    },
    {
      name: graphData[2]?.consumer_category,
      value: graphFilter(2),
    },
    {
      name: 'Other',
      value: graphFilter(3),
    },
  ]

  const convertToMW = (value: string, isCount: boolean) => {
    return Number(MWCount(value, isCount) ?? 0) / 1000
  }

  return (
    <div className='flex flex-row space-x-1 p-2 pb-8'>
      <div className='flex w-1/2 flex-col gap-1 pt-4'>
        {/* Total Connections */}
        <div className='flex flex-col border p-2'>
          <p className='xlmetric-1stop'>
            {graphValues?.data.length ? convertToMW('Total', false).toFixed(2) : <Skeleton />}
          </p>
          <div className='flex flex-row justify-between'>
            <p className='small-1stop-header'>Total MW</p>
            <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
              <input
                defaultChecked
                type='radio'
                name='radio'
                onClick={() => {
                  setVoltageType('Total')
                  setiSMW(true)
                }}
                className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
              />
            </div>
          </div>
        </div>

        <div className='flex w-full flex-row space-x-1'>
          {/* LT */}
          <div className='flex w-1/2 flex-col border p-2'>
            <p className='mdmetric-1stop'>
              {graphValues?.data.length ? convertToMW('LT', false).toFixed(2) : <Skeleton />}
            </p>
            <div className='flex flex-row justify-between'>
              <p className='small-1stop-header'>LT MW</p>
              <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                <input
                  type='radio'
                  name='radio'
                  onClick={() => {
                    setVoltageType('LT')
                    setiSMW(true)
                  }}
                  className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                />
              </div>
            </div>
          </div>

          {/* HT */}
          <div className='flex w-1/2 flex-col border p-2'>
            <p className='mdmetric-1stop'>
              {graphValues?.data.length ? convertToMW('HT', false).toFixed(2) : <Skeleton />}
            </p>
            <div className='flex flex-row justify-between'>
              <p className='small-1stop-header'>HT MW</p>
              <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                <input
                  type='radio'
                  name='radio'
                  onClick={() => {
                    setVoltageType('HT')
                    setiSMW(true)
                  }}
                  className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-row space-x-1'>
          {/* LT */}
          <div className='flex w-1/2 flex-col border p-2'>
            <p className='mdmetric-1stop'>
              {graphValues?.data.length ? formatNumber(MWCount('LT', true) ?? 0) : <Skeleton />}
            </p>
            <div className='flex flex-row justify-between'>
              <p className='small-1stop-header'>
                LT <br /> Prosumers{' '}
              </p>
              <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                <input
                  type='radio'
                  name='radio'
                  onClick={() => {
                    setVoltageType('LT')
                    setiSMW(false)
                  }}
                  className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                />
              </div>
            </div>
          </div>

          {/* HT */}
          <div className='flex w-1/2 flex-col border p-2'>
            <p className='mdmetric-1stop'>
              {graphValues?.data.length ? (
                formatNumber(MWCount('HT', true).toFixed(2))
              ) : (
                <Skeleton />
              )}
            </p>
            <div className='flex flex-row justify-between'>
              <p className='small-1stop-header'>HT Prosumers </p>
              <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                <input
                  type='radio'
                  name='radio'
                  onClick={() => {
                    setVoltageType('HT')
                    setiSMW(false)
                  }}
                  className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className='flex w-1/2 justify-center'>
        {graphValues?.data.length == 0 ? (
          <Skeleton
            circle={true}
            height={200}
            width={200}
          />
        ) : (
          <ResponsiveContainer className='small-1stop'>
            <PieChart
              width={200}
              height={200}
            >
              <Tooltip
                formatter={(value: number) => `${formatNumber(value.toFixed(2))}`}
                content={<CustomTooltip valueType='voltage' />}
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
      </div>
    </div>
  )
}

export default SolarProsumers
