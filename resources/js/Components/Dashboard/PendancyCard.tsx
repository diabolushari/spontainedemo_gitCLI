import React, { useCallback, useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link, router } from '@inertiajs/react'
import Card from '@/ui/Card/Card'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import DatePicker from '@/ui/form/DatePicker'
import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { format } from 'path'
import DataShowIcon from '../ui/DatashowIcon'
import Skeleton from 'react-loading-skeleton'
import { solidColors } from '@/ui/ui_interfaces'

export interface PendencyGraphValues {
  date: string
  request_type: string
  requests_completed_5_15_days____: number
  requests_completed_5_15_days__count_: number
  requests_completed_16_30_days____: number
  requests_completed_16_30_days__count_: number
  requests_completed__5_days____: number
  requests_completed__5_days__count_: number
  requests_completed__30_days____: number
  requests_completed__30_days__count_: number
  requests_completed__count_: number
  requests_completed_within_sla____: number
  requests_completed_within_sla__count_: number
  requests_received__count_: number
  sla_days: number
}

const PendancyCard = () => {
  const [title, setTitle] = useState('Load Change')
  const [toggleValue, settoggleValue] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }
  const [graphValues] = useFetchRecord<{
    data: PendencyGraphValues[]
    date: string
    latest_value: string
  }>(`/subset/96?${selectedDate == null ? 'latest=date' : `date=${selectedDate}`}`)
  useEffect(() => {
    if (selectedDate == null && graphValues != null) {
      setSelectedDate(graphValues.latest_value)
    }
  }, [setSelectedDate, graphValues, selectedDate])

  const lessThan5Days = toggleValue
    ? graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed__5_days____ || 0
    : graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed__5_days__count_ || 0

  const betweem515Days = toggleValue
    ? graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_5_15_days____ || 0
    : graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_5_15_days__count_ || 0
  const betweem1630Days = toggleValue
    ? graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_16_30_days____ || 0
    : graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_16_30_days__count_ || 0
  const greaterThan30Days = toggleValue
    ? graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed__30_days____ || 0
    : graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed__30_days__count_ || 0
  const complWithinSLa = toggleValue
    ? graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_within_sla____ || 0
    : graphValues?.data.find((value) => value.request_type === title)
        ?.requests_completed_within_sla__count_ || 0

  const data = [{ name: 'days', lessThan5Days, betweem515Days, betweem1630Days, greaterThan30Days }]
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
          <div className='small-1stop mb-2 font-bold'>{label}</div>
          <div>
            {payload.map((entry, index) => {
              const dataKey = entry.dataKey
                .replace(/_/g, ' ')
                .replace(
                  /\w\S*/g,
                  (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
                )

              return (
                <p
                  key={`tooltip-${index}`}
                  style={{ color: entry.color }}
                  className='small-1stop'
                >
                  {`${dataKey}:`}{' '}
                  <span className='small-1stop font-bold'>
                    {toggleValue ? `${Number(entry.value).toFixed(2)}%` : formatNumber(entry.value)}
                  </span>
                </p>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  const handleGraphSelection = useCallback(
    (subset: string) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Requests Completion Report',
          subset: subset,
          request_type: title,
          date: selectedDate,
          route: route('service-delivery.index'),
        })
      )
    },
    [selectedDate, title]
  )

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex h-5/6 w-full'>
        <div className='flex w-full flex-col rounded-lg p-3'>
          <div className='flex w-full justify-end'>
            <button
              className='small-1stop mb-auto cursor-pointer justify-end'
              onClick={handleToogleNumber}
            >
              {toggleValue ? <TooglePercentage /> : <ToogleNumber />}
            </button>
          </div>
          <div className='mt-1 flex flex-col items-start justify-start md:flex-row'>
            <div className='flex w-full flex-row justify-between gap-2 border p-2'>
              <div className='flex w-1/2 flex-col justify-center'>
                <p className='mdmetric-1stop'>
                  {isLoading ? (
                    <Skeleton width='100%' />
                  ) : (
                    <span className='xlmetric-1stop'>
                      {toggleValue ? `${complWithinSLa.toFixed(2)}%` : formatNumber(complWithinSLa)}
                    </span>
                  )}
                </p>
                <p className='small-1stop-header'>Compl. within SLA </p>
              </div>
              <div className='flex w-1/2 items-center'>
                <SelectList
                  setValue={setTitle}
                  list={graphValues?.data ?? []}
                  displayKey='request_type'
                  dataKey='request_type'
                  showAllOption
                  value={title}
                  style='1stop-small'
                />
              </div>
            </div>
          </div>

          <div className='flex w-full flex-col justify-center px-2 pt-10'>
            <p className='small-1stop-header text-center'>
              Request Completion {toggleValue ? '%' : ''} by Days Taken
            </p>

            <div className='flex w-full justify-center'>
              {isLoading ? (
                <Skeleton
                  width={300}
                  height={50}
                />
              ) : (
                <BarChart
                  width={300}
                  height={60}
                  data={data}
                  layout='vertical'
                >
                  {/* <Tooltip
                    formatter={
                      toggleValue
                        ? (value: number) => `${value.toFixed(2)}%`
                        : (value: number) => formatNumber(value)
                    }
                  /> */}

                  <Tooltip content={renderCustomTooltip} />
                  <XAxis
                    type='number'
                    hide
                  />
                  <YAxis
                    type='category'
                    dataKey='name'
                    hide
                  />
                  <Bar
                    dataKey='lessThan5Days'
                    stackId='a'
                    fill={solidColors[6]}
                    onClick={() => {
                      handleGraphSelection('Requests Completion - Less Than 5 Days')
                    }}
                  />
                  <Bar
                    dataKey='betweem515Days'
                    stackId='a'
                    fill={solidColors[0]}
                    onClick={() => {
                      handleGraphSelection('Requests Completion - 5 to 15 Days')
                    }}
                  />
                  <Bar
                    dataKey='betweem1630Days'
                    stackId='a'
                    fill={solidColors[7]}
                    onClick={() => handleGraphSelection('Requests Completion - 16 to 30 Days')}
                  />
                  <Bar
                    dataKey='greaterThan30Days'
                    stackId='a'
                    fill={solidColors[5]}
                    onClick={() => {
                      handleGraphSelection('Requests Completion - More Than 30 Days')
                    }}
                  />
                </BarChart>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 justify-center gap-2 pb-10 md:justify-start md:gap-5'>
            <div className='text-center'>
              <button
                className='smmetric-1stop'
                style={{ color: solidColors[6] }}
                onClick={() => {
                  handleGraphSelection('Requests Completion - Less Than 5 Days')
                }}
              >
                {toggleValue ? `${lessThan5Days.toFixed(2)}%` : formatNumber(lessThan5Days)}
              </button>
              <div className='small-1stop'>{'<5 days'}</div>
            </div>
            <div className='text-center'>
              <button
                className='smmetric-1stop'
                style={{ color: solidColors[0] }}
                onClick={() => {
                  handleGraphSelection('Requests Completion - 5 to 15 Days')
                }}
              >
                {toggleValue ? `${betweem515Days.toFixed(2)}%` : formatNumber(betweem515Days)}
              </button>
              <div className='small-1stop'>5-15 days</div>
            </div>
            <div className='text-center'>
              <button
                className='smmetric-1stop'
                style={{ color: solidColors[7] }}
                onClick={() => handleGraphSelection('Requests Completion - 16 to 30 Days')}
              >
                {toggleValue ? `${betweem1630Days.toFixed(2)}%` : formatNumber(betweem1630Days)}
              </button>
              <div className='small-1stop'>16-30 days</div>
            </div>
            <div className='text-center'>
              <button
                className='smmetric-1stop'
                style={{ color: solidColors[5] }}
                onClick={() => {
                  handleGraphSelection('Requests Completion - More Than 30 Days')
                }}
              >
                {toggleValue ? `${greaterThan30Days.toFixed(2)}%` : formatNumber(greaterThan30Days)}
              </button>
              <div className='small-1stop'>{'>30 days'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-1/6 items-center justify-end gap-4 rounded-b-2xl bg-1stop-alt-gray px-4'>
        <div className='small-1stop-header flex h-full items-center bg-1stop-accent2 py-2'>
          <DatePicker
            value={selectedDate ?? ''}
            setValue={setSelectedDate}
            disabled={false}
          />
        </div>

        <div className='flex items-center pl-2 hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Requests Completion Report?date=${selectedDate}&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default PendancyCard
