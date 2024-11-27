import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import useFetchRecord from '@/hooks/useFetchRecord'
import NewConnectionTrend from '../ServiceDelivery/NewConnection/NewConnectionTrend'
import { div } from 'framer-motion/client'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'

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

  const [selectedLevel, setSelectedLevel] = useState(1)

  const [graphValues] = useFetchRecord<{
    data: NewConnectionGraphValues[]
    month: number
    year: number
    latest_value: string
  }>(
    `subset/63?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const slaPerf = isLoading
    ? 0
    : toggleValue
      ? graphValues.data[0]?.sla_perf_cnt || 0
      : graphValues.data[0]?.sla_perf__ || 0
  const completedBeyondSla = isLoading
    ? 0
    : toggleValue
      ? graphValues.data[0]?.compl_beyond_sla_cnt || 0
      : graphValues.data[0]?.compl_beyond_sla__ || 0
  const completedWithinSla = isLoading
    ? 0
    : toggleValue
      ? graphValues.data[0]?.compl_within_sla_cnt || 0
      : graphValues.data[0]?.compl_within_sla__ || 0
  const pendingBeyondSla = isLoading
    ? 0
    : toggleValue
      ? graphValues.data[0]?.pend_beyond_sla_cnt || 0
      : graphValues.data[0]?.pend_beyond_sla__ || 0
  const pendingWithinSla = isLoading
    ? 0
    : toggleValue
      ? graphValues.data[0]?.pend_within_sla_cnt || 0
      : graphValues.data[0]?.pend_within_sla__ || 0

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
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
          <button
            className={`flex w-full rounded-tl-2xl border px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <div className='flex w-full items-center justify-center'>
              <svg
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2.33398 12.8332L11.3757 9.9165'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M16.334 9.3335L25.6673 7.5835'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M17.5 11.375L25.6667 12.25'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M19.0742 14L25.6659 16.9167'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </button>
          <button
            className={`flex w-full border px-2 py-4 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <div className='flex w-full items-center justify-center'>
              <svg
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M22.75 3.5H5.25C4.2835 3.5 3.5 4.2835 3.5 5.25V22.75C3.5 23.7165 4.2835 24.5 5.25 24.5H22.75C23.7165 24.5 24.5 23.7165 24.5 22.75V5.25C24.5 4.2835 23.7165 3.5 22.75 3.5Z'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinejoin='round'
                />
                <path
                  d='M7.83984 17.4035L11.1397 14.1037L13.6994 16.6573L19.8333 10.5'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M15.166 10.5H19.8327V15.1667'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </button>
          <button
            className={`flex w-full border px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <div className='flex w-full items-center justify-center'>
              <svg
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M13.416 5.25H25.0827'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2.91602 9.33317L7.58268 4.6665'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M7.58398 4.6665V24.4998'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.416 11.0835H22.7493'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.416 16.9165H20.416'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M13.416 22.75H18.0827'
                  stroke='#333333'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </button>
          <div
            className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
          >
            <p></p>
          </div>
          <div
            className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
          >
            <p></p>
          </div>
        </div>
        {selectedLevel === 1 && (
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
                  ) : toggleValue ? (
                    formatNumber(slaPerf)
                  ) : (
                    `${slaPerf.toFixed(2)}%`
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
                    ) : toggleValue ? (
                      formatNumber(completedWithinSla)
                    ) : (
                      `${completedWithinSla.toFixed(2)}%`
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
                    ) : toggleValue ? (
                      formatNumber(pendingWithinSla)
                    ) : (
                      `${pendingWithinSla.toFixed(2)}%`
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
                    ) : toggleValue ? (
                      formatNumber(completedBeyondSla)
                    ) : (
                      `${completedBeyondSla.toFixed(2)}%`
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
                    ) : toggleValue ? (
                      formatNumber(pendingBeyondSla)
                    ) : (
                      `${pendingBeyondSla.toFixed(2)}%`
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
                    <Tooltip
                      formatter={
                        toggleValue
                          ? (value: number) => formatNumber(value)
                          : (value: number) => `${value.toFixed(2)}%`
                      }
                      labelStyle={{ fontSize: '10' }}
                    />

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
        )}
        {selectedLevel === 2 && (
          <NewConnectionTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-button-muted px-4 pl-14'>
        <div className='w-1/3'>
          <p className='h3-1stop'>Servicing New Connections</p>
        </div>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4 py-4'>
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
          <Link href='/data-explorer/SLA Performance - New Connection Requests'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default NewConnections
