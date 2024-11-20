import React, { useEffect, useState } from 'react'
import InactiveGraph from './Graphs/InactiveGraph'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import { User } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import { OfficeInfo } from '@/interfaces/dashboard_accordion'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
  user: User
}

export interface InactiveGraphValues {
  conn_status_code: string
  consumer_count: number
  data_date: string
  consumer_category: string
  voltage: string
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
//DOMESTIC
//LOCAL BODIES
//PUBLIC INSTITUTIONS
//STATE GOVERNMENT  DEPARTMENTS
//STATE PUBLIC SECTOR UNDERTAKINGS
//CENTRAL GOVERNMENT DEPARTMENTS
//CENTRAL PUBLIC SECTOR UNDERTAKINGS
//NON PAYING GROUP
//KSEBoard

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
          return (
            <li
              key={`item-${index}`}
              style={{ marginRight: 10, color: 'black' }}
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
              {entry.value}
            </li>
          )
        }
      )}
    </ul>
  )
}
// --------------------------------------------------

export const formatNumber = (value: number) => {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + ' Cr'
  } else if (value >= 100000) {
    return (value / 100000).toFixed(2) + ' L'
  }
  return value.toString()
}

const ActiveConnection = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('ST')
  const [voltageType, setVoltageType] = useState('Total')
  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>(route('find-level'))
  const [graphValues] = useFetchList<InactiveGraphValues>(
    `subset/57?${levelName}=${levelCode}&month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1}`
  )

  graphValues.sort((a, b) => a.consumer_count - b.consumer_count).reverse()

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

  const filters = (value: InactiveGraphValues, index: number) => {
    if (index < 3) {
      if (voltageType == 'Total') {
        return value.consumer_category === graphValues[index].consumer_category
      } else {
        return (
          value.consumer_category === graphValues[index].consumer_category &&
          value.voltage == voltageType
        )
      }
    } else {
      if (voltageType == 'Total') {
        return (
          value.consumer_category !== graphValues[0]?.consumer_category &&
          value.consumer_category !== graphValues[1]?.consumer_category &&
          value.consumer_category !== graphValues[2]?.consumer_category
        )
      } else {
        return (
          value.consumer_category !== graphValues[0]?.consumer_category &&
          value.consumer_category !== graphValues[1]?.consumer_category &&
          value.consumer_category !== graphValues[2]?.consumer_category &&
          value.voltage == voltageType
        )
      }
    }
  }
  const totalConnections = graphValues.reduce((sum, value) => sum + value.consumer_count, 0)

  const ltConnections = graphValues
    .filter((value) => value.voltage === 'LT')
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const htConnections = graphValues
    .filter((value) => value.voltage === 'HT')
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const ehtConnections = graphValues
    .filter((value) => value.voltage === 'EHT')
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const graphFilterOne = graphValues
    .filter((value) => filters(value, 0))
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const graphFilterTwo = graphValues
    .filter((value) => filters(value, 1))
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const graphFilterThree = graphValues
    .filter((value) => filters(value, 2))
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const graphFilterFour = graphValues
    .filter(
      (value) =>
        value.consumer_category !== graphValues[0]?.consumer_category &&
        value.consumer_category !== graphValues[1]?.consumer_category &&
        value.consumer_category !== graphValues[2]?.consumer_category &&
        value.voltage == voltageType
    )
    .reduce((sum, value) => sum + value.consumer_count, 0)
  const data = [
    { name: graphValues[0]?.consumer_category, value: graphFilterOne },
    { name: graphValues[1]?.consumer_category, value: graphFilterTwo },
    { name: graphValues[2]?.consumer_category, value: graphFilterThree },
    { name: 'Other', value: graphFilterFour },
  ]

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
                {graphValues.length ? formatNumber(totalConnections) : <Skeleton />}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total </p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    defaultChecked
                    type='radio'
                    name='radio'
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
                  {graphValues.length ? formatNumber(ltConnections) : <Skeleton />}
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
                  {graphValues.length ? formatNumber(htConnections) : <Skeleton />}
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
                {graphValues.length ? formatNumber(ehtConnections) : <Skeleton />}
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
          <div className='flex w-1/2 justify-center pt-2'>
            {graphValues.length == 0 ? (
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
        <p className='h3-1stop'>Active connections</p>
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
export default ActiveConnection
