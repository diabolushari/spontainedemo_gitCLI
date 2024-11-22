import React, { useEffect, useState } from 'react'
import { CustomLegend, formatNumber, InactiveGraphValues } from './ActiveConnection'
import { OfficeInfo } from '@/interfaces/dashboard_accordion'
import useFetchRecord from '@/hooks/useFetchRecord'
import Card from '@/ui/Card/Card'
import Skeleton from 'react-loading-skeleton'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'

interface SolarProsumersValue {
  consumer_count: number
  month_year: string
  consumer_category: string
  voltage: string
  capacity_kw: number
}

const SolarProsumers = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('ST')
  const [voltageType, setVoltageType] = useState('Total')
  const [isMW, setiSMW] = useState(true)
  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>(route('find-level'))
  const [graphValues] = useFetchRecord<{ data: SolarProsumersValue[] }>(
    `subset/71?${levelName}=${levelCode}&month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
  )

  graphValues?.data.sort((a, b) => a.consumer_count - b.consumer_count).reverse()

  useEffect(() => {
    switch (level?.level) {
      case 'region':
        setLevelName('office_code')
        setLevelCode(level.record.region_code ?? '')
        break
      case 'circle':
        setLevelName('office_code')
        setLevelCode(level.record.circle_code ?? '')
        break
      case 'division':
        setLevelName('office_code')
        setLevelCode(level.record.division_code ?? '')
        break
      case 'subdivision':
        setLevelName('office_code')
        setLevelCode(level.record.subdivision_code ?? '')
        break
      case 'section':
        setLevelName('section_code')
        setLevelCode(level.record.section_code ?? '')
        break
    }
  }, [level])

  const filters = (value: SolarProsumersValue, index: number) => {
    if (index < 3) {
      if (voltageType == 'Total') {
        return value.consumer_category === graphValues?.data[index].consumer_category
      } else {
        return (
          value.consumer_category === graphValues?.data[index].consumer_category &&
          value.voltage == voltageType
        )
      }
    } else {
      if (voltageType == 'Total') {
        return (
          value.consumer_category !== graphValues?.data[0]?.consumer_category &&
          value.consumer_category !== graphValues?.data[1]?.consumer_category &&
          value.consumer_category !== graphValues?.data[2]?.consumer_category
        )
      } else {
        return (
          value.consumer_category !== graphValues?.data[0]?.consumer_category &&
          value.consumer_category !== graphValues?.data[1]?.consumer_category &&
          value.consumer_category !== graphValues?.data[2]?.consumer_category &&
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
      return graphValues?.data
        .filter((value) => filters(value, index))
        .reduce((sum, value) => sum + value.consumer_count, 0)
    } else {
      const count =
        graphValues?.data
          .filter((value) => filters(value, index))
          .reduce((sum, value) => sum + value.capacity_kw, 0) ?? 0
      return count / 1000
    }
  }

  const data = [
    {
      name: graphValues?.data[0]?.consumer_category,
      value: graphFilter(0),
    },
    {
      name: graphValues?.data[1]?.consumer_category,
      value: graphFilter(1),
    },
    {
      name: graphValues?.data[2]?.consumer_category,
      value: graphFilter(2),
    },
    {
      name: 'Other',
      value: graphFilter(3),
    },
  ]

  const convertToMW = (value: string, isCount: boolean) => {
    return Number(formatNumber(MWCount(value, isCount) ?? 0)) / 1000
  }

  const COLORS = ['#3E80E4', '#EA5BA5', '#FCB216', '#E3FE3C']
  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
          <div
            className={`rounded-tl-2xl border p-5 ${selectedLevel === 'ST' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel('ST')
            }}
          >
            <p>ST</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'RG' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel('RG')
            }}
          >
            <p>RG</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'CR' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel('CR')
            }}
          >
            <p>CR</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
              setSelectedLevel('DV')
            }}
          >
            <p>DV</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
              setSelectedLevel('SD')
            }}
          >
            <p>SD</p>
          </div>
        </div>
        <div className='flex w-5/6 flex-row gap-4 p-2'>
          <div className='flex w-1/2 flex-col gap-1 pt-4'>
            {/* Total Connections */}
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {graphValues?.data.length ? convertToMW('Total', false).toFixed(3) : <Skeleton />}
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
                  {graphValues?.data.length ? convertToMW('LT', false).toFixed(3) : <Skeleton />}
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
                  {graphValues?.data.length ? convertToMW('HT', false).toFixed(3) : <Skeleton />}
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
                  <p className='small-1stop-header'>LT consumers </p>
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
                  {graphValues?.data.length ? formatNumber(MWCount('HT', true) ?? 0) : <Skeleton />}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>HT consumers </p>
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
          <div className='flex w-1/2 justify-center pt-2'>
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
                  <Tooltip />
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
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend content={CustomLegend} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Solar Prosumers</p>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
        new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })} */}
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/17'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default SolarProsumers
