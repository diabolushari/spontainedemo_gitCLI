import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { PieChart, Pie, Cell, Legend } from 'recharts'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface NewConnectionGraphValues {
  data_date: string
  service_group: string
  received_cnt: number
  completed_cnt: number
  section_code: number
  within_sla_cnt: number
  beyond_sla_cnt: number
  avg_beyond_sla_days: Float32Array
  avg_within_sla_days: Float32Array
}

const NewConnections = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<NewConnectionGraphValues>(`subset/22?office_code=${levelCode}`)
  console.log(graphValues)
  const completedWithinSLA = graphValues[0]?.completed_cnt || 0
  const receivedCount = graphValues[0]?.received_cnt || 0
  const withinSlaCount = graphValues[0]?.within_sla_cnt || 0
  const beyondSlaCount = graphValues[0]?.beyond_sla_cnt || 0
  const avgBeyondSlaDays = graphValues[0]?.avg_beyond_sla_days || 0
  const avgWithinSlaDays = graphValues[0]?.avg_within_sla_days || 0

  const data = [
    { name: 'Within SLA', value: withinSlaCount },
    { name: 'Beyond SLA', value: beyondSlaCount },
  ]
  const latestDataDate = graphValues
    .map((item) => item.data_date)
    .sort()
    .reverse()[0]

  const COLORS = ['#3E80E4', '#FCB216']

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
        {payload.map((entry: any, index: number) => (
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
        ))}
      </ul>
    )
  }

  return (
    <div className='flex h-full flex-col justify-between rounded-lg bg-white p-6'>
      <div className='flex items-center justify-between'>
        <div className='w-1/2 text-left'>
          <h2 className='h1-1stop text-4xl font-bold'>
            {completedWithinSLA}/{receivedCount}
          </h2>
          <p className='body-1stop text-lg'>New Svc Connections</p>
          <p className='body-1stop mb-6 text-lg'>Completed Within SLA</p>

          <div className='flex space-x-12'>
            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{withinSlaCount}</p>
              </div>
              <p className='small-1stop font-extrabold'>Completed</p>
              <p className='small-1stop font-extrabold'> Within SLA</p>
            </div>

            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{beyondSlaCount}</p>
              </div>
              <p className='small-1stop font-extrabold'>Completed </p>
              <p className='small-1stop font-extrabold'> Beyond SLA</p>
            </div>
          </div>

          <div className='mt-5 flex space-x-12'>
            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{avgWithinSlaDays.toFixed(2)}</p>
                <p className='small-1stop ml-2 mt-3 font-bold'>Days</p>
              </div>
              <p className='small-1stop font-bold'>Avg Pendency</p>
              <p className='small-1stop font-bold'> Within SLA</p>
            </div>

            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{avgBeyondSlaDays.toFixed(2)}</p>
                <p className='small-1stop ml-2 mt-3 font-bold'>Days</p>
              </div>
              <p className='small-1stop font-bold'>Avg Pendency </p>
              <p className='small-1stop font-bold'> Beyond SLA</p>
            </div>
          </div>
        </div>

        <div className='small-1stop w-1/2'>
          <PieChart
            width={300}
            height={200}
          >
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
            <Legend content={renderLegend} />
          </PieChart>
        </div>
      </div>

      <p className='small-1stop-header mt-4 self-end text-right'>Last Updated {latestDataDate}</p>
    </div>
  )
}

export default NewConnections
