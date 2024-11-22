import useFetchList from '@/hooks/useFetchList'
import React, { useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'

export interface NewConnectionGraphValues {
  compl_beyond_sla__: number
  compl_beyond_sla_cnt: number
  compl_within_sla__: number
  compl_within_sla_cnt: number
  month_year: string
  pend_beyond_sla__: number
  pend_beyond_sla_cnt: number
  pend_within_sla__: number
  pend_within_sla_cnt: number
  sla_perf__: number
  sla_perf_cnt: number
  sla_svc_group: string
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

const NewConnections = () => {
  const [toggleValue, settoggleValue] = useState<boolean>(false)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [graphValues] = useFetchList<NewConnectionGraphValues>(
    `subset/63?month_year=${selectedMonth?.getFullYear()}${selectedMonth?.getMonth() + 1}`
  )

  const isLoading = !graphValues || graphValues.length === 0
  const slaPerf = isLoading
    ? 0
    : toggleValue
      ? graphValues[0]?.sla_perf_cnt || 0
      : graphValues[0]?.sla_perf__ || 0
  const completedBeyondSla = isLoading
    ? 0
    : toggleValue
      ? graphValues[0]?.compl_beyond_sla_cnt || 0
      : graphValues[0]?.compl_beyond_sla__ || 0
  const completedWithinSla = isLoading
    ? 0
    : toggleValue
      ? graphValues[0]?.compl_within_sla_cnt || 0
      : graphValues[0]?.compl_within_sla__ || 0
  const pendingBeyondSla = isLoading
    ? 0
    : toggleValue
      ? graphValues[0]?.pend_beyond_sla_cnt || 0
      : graphValues[0]?.pend_beyond_sla__ || 0
  const pendingWithinSla = isLoading
    ? 0
    : toggleValue
      ? graphValues[0]?.pend_within_sla_cnt || 0
      : graphValues[0]?.pend_within_sla__ || 0

  //   const avgWithinSlaDays = isLoading ? 0 : graphValues[0]?.avg_within_sla_days || 0

  const data = [
    { name: 'Completed within SLA', value: completedWithinSla },
    { name: 'Completed beyond SLA', value: completedBeyondSla },
    { name: 'Pending within SLA', value: pendingWithinSla },
    { name: 'pending beyond SLA', value: pendingBeyondSla },
  ]

  const COLORS = ['#3E80E4', '#FCB216', '#D467B3', '#e3fe3c']

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }
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
            <button
              className='small-1stop mb-auto cursor-pointer justify-end'
              onClick={handleToogleNumber}
            >
              {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
            </button>
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {isLoading ? (
                  <Skeleton width='50%' />
                ) : (
                  `${slaPerf.toFixed(2)}${toggleValue ? '' : '%'}`
                )}
              </p>

              <div className='flex flex-row justify-between'>
                <p className='small-1stop'>Overall New Svc Connection SLA perf. </p>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='h3-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : (
                    `${completedWithinSla.toFixed(2)}${toggleValue ? '' : '%'}`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop'>Compl. within SLA </p>
                </div>
              </div>

              <div className='flex w-1/2 flex-col border p-2'>
                <p className='h3-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : (
                    `${pendingWithinSla.toFixed(2)}${toggleValue ? '' : '%'}`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop'>Pending within SLA </p>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='h3-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : (
                    `${completedBeyondSla.toFixed(2)}${toggleValue ? '' : '%'}`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop'>Compl. beyond SLA </p>
                </div>
              </div>

              <div className='flex w-1/2 flex-col border p-2'>
                <p className='h3-1stop'>
                  {isLoading ? (
                    <Skeleton width='25%' />
                  ) : (
                    `${pendingBeyondSla.toFixed(2)}${toggleValue ? '' : '%'}`
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop'>Pending beyond SLA </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex w-1/2 justify-center pt-2'>
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
                  <Tooltip formatter={(value: number) => value.toFixed(2)} />
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
        <p className='h3-1stop text-wrap'>Servicing New Connections</p>
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
          <Link href='/dataset/59'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default NewConnections
