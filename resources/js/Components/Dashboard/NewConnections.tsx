import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'

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

const NewConnections = ({ section_code }: Properties) => {
  const [graphValues] = useFetchList<NewConnectionGraphValues>(
    `subset/14?section_code=${section_code}`
  )

  const filteredGraphValues = graphValues.filter((item) => item.service_group === 'New Connection')
  const totalReceived = filteredGraphValues.reduce((acc, item) => acc + item.received_cnt, 0)
  const totalCompleted = filteredGraphValues.reduce((acc, item) => acc + item.completed_cnt, 0)
  const beyondSLA = filteredGraphValues.reduce((acc, item) => acc + item.beyond_sla_cnt, 0)
  const withinSLA = filteredGraphValues.reduce((acc, item) => acc + item.within_sla_cnt, 0)
  const avgWithinSLADays =
    filteredGraphValues.length > 0
      ? filteredGraphValues.reduce((acc, item) => acc + item.avg_within_sla_days, 0) /
        filteredGraphValues.length
      : 0
  const data = [
    { name: 'Within SLA', value: withinSLA },
    { name: 'Beyond SLA', value: beyondSLA },
  ]
  const latestDataDate = filteredGraphValues
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
  //console.log(graphValues)
  console.log(filteredGraphValues)
  return (
    <div className='flex h-full flex-col justify-between rounded-lg bg-white p-6'>
      <div className='flex items-center justify-between'>
        <div className='w-1/2 text-left'>
          <h2 className='h1-1stop mt-7 text-4xl font-bold'>
            {totalCompleted}/{totalReceived}
          </h2>
          <p className='body-1stop text-lg'>New Connections</p>
          <p className='body-1stop mb-6 text-lg'>Completed Within SLA</p>

          <div className='flex space-x-12'>
            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{avgWithinSLADays.toFixed(2)}</p>
                <p className='small-1stop ml-2 mt-3 font-bold'>Days</p>
              </div>
              <p className='small-1stop font-bold'>Avg Pendency</p>
              <p className='small-1stop font-bold'> Within SLA</p>
            </div>

            <div className='text-center'>
              <div className='flex'>
                <p className='text-3xl font-semibold'>{beyondSLA}</p>
                <p className='small-1stop ml-2 mt-3 font-bold'>Days</p>
              </div>
              <p className='small-1stop font-bold'>Pendency </p>
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
