import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface SlaPerformanceValues {
  data_date: string
  section_code: number
  service_group: string
  received_cnt: number
  completed_cnt: number
  sla_days: number
  within_sla_cnt: number
  days_taken: number
  beyond_sla_cnt: number
  avg_within_sla_days: number
  avg_beyond_sla_days: number
}

const SlaPerformance = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<SlaPerformanceValues>(`subset/23?office_code=${levelCode}`)

  // Group and aggregate data by `service_group`
  const groupedData = Array.from(
    new Map(
      graphValues.map(({ service_group, within_sla_cnt, beyond_sla_cnt }) => [
        service_group,
        { name: service_group, within_sla_cnt, beyond_sla_cnt },
      ])
    ).values()
  )
  const CustomTick = (props) => {
    const { x, y, payload } = props
    const displayName =
      payload.value.length > 10 ? `${payload.value.slice(0, 9)}...` : payload.value

    return (
      <text
        x={x}
        y={y}
        dy={16}
        textAnchor='end'
        transform={`rotate(-45, ${x}, ${y})`}
        className='axial-label-1stop'
      >
        {displayName}
      </text>
    )
  }

  const isLoading = !graphValues || graphValues.length === 0

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex h-full w-1/12 flex-col rounded-2xl'>
          <div className='rounded-tl-2xl border bg-1stop-highlight2 p-5'>
            <p>ST</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>RG</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>CR</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>DV</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>SD</p>
          </div>
        </div>
        <div className='flex w-11/12 flex-row gap-4 p-2'>
          <div className='w-full rounded-lg bg-white p-4'>
            <div>
              {isLoading ? (
                <Skeleton
                  height={400}
                  width='100%'
                />
              ) : (
                <ResponsiveContainer
                  width='100%'
                  height={300}
                >
                  <BarChart
                    data={groupedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='name'
                      tick={<CustomTick />}
                      height={80}
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip />
                    <Bar
                      dataKey='within_sla_cnt'
                      stackId='a'
                      fill='#1b50b3'
                    />
                    <Bar
                      dataKey='beyond_sla_cnt'
                      stackId='a'
                      fill='#76a5ff'
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>SLA Performance by Request Type</p>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
            new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} */}
          <MonthPicker />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/38'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default SlaPerformance
