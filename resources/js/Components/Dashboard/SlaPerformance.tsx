import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'

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
    <div className='rounded-lg bg-white p-4'>
      <h3 className='h3-1stop pb-5'>Category-wise SLA Performance</h3>
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
      <div className='flex w-full justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href='/dataset/38'>
          <MoreButton />
        </Link>
      </div>
    </div>
  )
}

export default SlaPerformance
