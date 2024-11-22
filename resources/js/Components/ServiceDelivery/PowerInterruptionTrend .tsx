import useFetchList from '@/hooks/useFetchList'
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import Card from '@/ui/Card/Card'
import { OfficeInfo } from '@/interfaces/dashboard_accordion'
import useFetchRecord from '@/hooks/useFetchRecord'
import MonthPicker from '@/ui/form/MonthPicker'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface PowerInterruptionValues {
  request_date: string
  powerfailures: number
}

const PowerInterruptionTrend = ({ section_code, levelName, levelCode }: Properties) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  // const [levelName, setLevelName] = useState('')
  // const [levelCode, setLevelCode] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('ST')
  const [voltageType, setVoltageType] = useState('Total')

  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>(route('find-level'))
  const [graphValues] = useFetchRecord<{ data: PowerInterruptionValues[] }>(
    `subset/33?${levelName}=${levelCode}`
  )
  const [chartData, setChartData] = useState<{ day: string; interruptions: number }[]>([])

  useEffect(() => {
    if (graphValues && graphValues.length > 0) {
      const sortedData = [...graphValues].sort(
        (a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
      )

      const formattedData = sortedData.map((item, index) => ({
        day: `Day ${index + 1}`,
        interruptions: item.powerfailures,
      }))

      setChartData(formattedData)
    }
  }, [graphValues])
  const isLoading = !graphValues || graphValues.length === 0
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
          {/* Graph */}
          <div className='pl-5'>
            {isLoading ? (
              <Skeleton
                height={200}
                width='100%'
              />
            ) : (
              <ResponsiveContainer
                width='100%'
                height={200}
              >
                <AreaChart data={chartData}>
                  <XAxis
                    dataKey='day'
                    hide
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type='monotone'
                    dataKey='interruptions'
                    stroke='#0091ff'
                    fill='#0091ff'
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Complaint Types: Comparitive</p>
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

export default PowerInterruptionTrend
