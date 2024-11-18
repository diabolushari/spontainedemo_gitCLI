import useFetchList from '@/hooks/useFetchList'
import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'

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

interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

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

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
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
        <div className='flex w-5/6 flex-row gap-4 p-2'>
          <div className='flex w-1/2 flex-col gap-1 pt-4'>
            {/* Total Connections */}
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {isLoading ? <Skeleton width='50%' /> : `${withinSlaCount}/${receivedCount}`}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total </p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    defaultChecked
                    type='radio'
                    name='radio'
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues.length ? formatNumber(totalDomesticConnections) : <Skeleton />}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>LT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              {/* HT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues.length ? formatNumber(totalNonDomesticConnections) : <Skeleton />}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>HT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EHT */}
            <div className='flex flex-col border p-2'>
              <p className='mdmetric-1stop'>
                {graphValues.length ? formatNumber(totalDomesticConnections) : <Skeleton />}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>EHT </p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    type='radio'
                    name='radio'
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className='flex w-1/2 justify-center pt-2'>
            {graphValues ? (
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
          <MonthPicker />
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

export default NewConnections
