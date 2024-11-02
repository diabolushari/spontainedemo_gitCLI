import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'

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
  avg_beyond_sla_days: number
  avg_within_sla_days: number
}

const NewConnections = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<NewConnectionGraphValues>(`subset/27?office_code=${levelCode}`)

  const isLoading = !graphValues || graphValues.length === 0

  const totalReceivedCnt = graphValues.reduce((sum, value) => sum + value.received_cnt, 0)
  const totalSlaCount = graphValues.reduce((sum, value) => sum + value.within_sla_cnt, 0)
  const totalBeyondSlaCount = graphValues.reduce((sum, value) => sum + value.beyond_sla_cnt, 0)

  const receivedCount = isLoading ? 0 : totalReceivedCnt || 0
  const withinSlaCount = isLoading ? 0 : totalSlaCount || 0
  const beyondSlaCount = isLoading ? 0 : totalBeyondSlaCount || 0

  const totalBeyondSlaDays = graphValues.reduce(
    (sum, value) => sum + value.beyond_sla_cnt * value.avg_beyond_sla_days,
    0
  )
  const avgBeyondSlaDays = isLoading
    ? 0
    : beyondSlaCount > 0
      ? totalBeyondSlaDays / beyondSlaCount
      : 0

  const totalWithinSlaDays = graphValues.reduce(
    (sum, value) => sum + value.within_sla_cnt * value.avg_within_sla_days,
    0
  )
  const avgWithinSlaDays = isLoading
    ? 0
    : withinSlaCount > 0
      ? totalWithinSlaDays / withinSlaCount
      : 0

  //   const avgWithinSlaDays = isLoading ? 0 : graphValues[0]?.avg_within_sla_days || 0

  const data = [
    { name: 'Completed within SLA', value: withinSlaCount },
    { name: 'Completed beyond SLA', value: beyondSlaCount },
  ]

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
    <div className='flex h-full flex-col rounded-lg bg-white p-6'>
      <div className='flex flex-row text-left'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1 py-2'>
            <p className='xlmetric-1stop'>
              {isLoading ? <Skeleton width='50%' /> : `${withinSlaCount}/${receivedCount}`}
            </p>
            <p className='small-1stop-header'>
              New Svc Connections <br /> Completed Within SLA
            </p>
          </div>

          <div className='flex w-full space-x-2 py-1'>
            <div className='flex w-1/2 flex-col'>
              <p className='mdmetric-1stop'>
                {isLoading ? <Skeleton width={50} /> : withinSlaCount}
              </p>
              <p className='small-1stop-header'>
                Completed <br /> Within SLA
              </p>
            </div>

            <div className='flex w-1/2 flex-col'>
              <p className='mdmetric-1stop'>
                {isLoading ? <Skeleton width={50} /> : beyondSlaCount}
              </p>
              <p className='small-1stop-header'>
                Completed <br /> Beyond SLA{' '}
              </p>
            </div>
          </div>

          <div className='flex w-full space-x-2 py-1'>
            <div className='flex w-1/2 flex-col'>
              <div className='flex items-center space-x-1'>
                <p className='mdmetric-1stop'>
                  {isLoading ? <Skeleton width={50} /> : avgWithinSlaDays.toFixed(2)}
                </p>
                <p className='small-1stop'>Days</p>
              </div>
              <div className='w-full'>
                <p className='small-1stop-header'>Avg Pendency Within SLA </p>
              </div>
            </div>

            <div className='flex w-1/2 flex-col'>
              <div className='flex items-center space-x-1'>
                <p className='mdmetric-1stop'>
                  {isLoading ? <Skeleton width={50} /> : avgBeyondSlaDays.toFixed(2)}
                </p>
                <p className='small-1stop'>Days</p>
              </div>
              <div className='w-full'>
                <p className='small-1stop-header'>Avg Pendency Beyond SLA </p>
              </div>
            </div>
          </div>
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
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href='/dataset/37'>
          <MoreButton />
        </Link>
      </div>

      {/* <p className='small-1stop-header mt-4 self-end text-right'>Last Updated {latestDataDate}</p> */}
    </div>
  )
}

export default NewConnections
