import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Properties {
  section_code?: string
}

export interface NewConnectionGraphValues {
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

const SlaPerformance = ({ section_code }: Properties) => {
  const [graphValues] = useFetchList<NewConnectionGraphValues>(
    `subset/14?section_code=${section_code}`
  )

  // Group and aggregate data by `service_group`
  const groupedData = graphValues.reduce(
    (acc, item) => {
      const { service_group, within_sla_cnt, beyond_sla_cnt } = item
      const existingEntry = acc.find((entry) => entry.name === service_group)

      if (existingEntry) {
        existingEntry.within_sla_cnt += within_sla_cnt
        existingEntry.beyond_sla_cnt += beyond_sla_cnt
      } else {
        acc.push({
          name: service_group,
          within_sla_cnt,
          beyond_sla_cnt,
        })
      }

      return acc
    },
    [] as Array<{ name: string; within_sla_cnt: number; beyond_sla_cnt: number }>
  )

  return (
    <div className='rounded-lg bg-white p-4'>
      <h3 className='h3-1stop pb-5'>Category-wise SLA Performance</h3>
      <div>
        <ResponsiveContainer
          width='100%'
          minWidth={700}
          height={400}
        >
          <BarChart
            data={groupedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              tick={{
                // angle: -45,
                textAnchor: 'end',
              }}
              height={80}
              interval={0}
              tickFormatter={(name) => (name.length > 10 ? `${name.slice(0, 9)}...` : name)}
            />
            <YAxis />
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
      </div>
    </div>
  )
}

export default SlaPerformance
