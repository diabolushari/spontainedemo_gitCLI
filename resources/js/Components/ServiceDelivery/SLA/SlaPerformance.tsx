import TooglePercentage from '@/Components/ui/TogglePercentage'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import useFetchRecord from '@/hooks/useFetchRecord'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SlaTrend, { SlaTrendValues } from './SlaTrend'
import { Link } from '@inertiajs/react'
import MoreButton from '@/Components/MoreButton'
import TopList from '../NewConnectionsList'
import SlaList from './SlaList'
import { formatNumber } from '../ActiveConnection'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import TrendIcon from '@/Components/ui/TrendIcon'
import Top10Icon from '@/Components/ui/Top10Icon'

export interface SlaPerformanceValues {
  month: string
  request_type: string
  requests_completed_beyond_sla____: number
  requests_completed_beyond_sla__count_: number
  requests_completed_within_sla____: number
  requests_completed_within_sla__count_: number
  requests_pending_beyond_sla____: number
  requests_pending_beyond_sla__count_: number
  requests_pending_within_sla____: number
  requests_pending_within_sla__count_: number
}

const SlaPerformance = () => {
  const [toggleValue, settoggleValue] = useState<boolean>(false)
  const [categories, setCategories] = useState<{ sla_svc_group: string }[]>([])
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [graphValues] = useFetchRecord<{
    data: SlaPerformanceValues[]
    latest_value: string
  }>(
    `subset/128?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )

  // const monthYear = selectedMonth
  //   ? `${selectedMonth.getFullYear()}${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}`
  //   : null
  // const [SlaTrendValues] = useFetchRecord<{
  //   data: SlaTrendValues[]
  //   latest_value: string
  // }>(
  //   `subset/78?${
  //     selectedMonth == null
  //       ? 'latest=month_year'
  //       : `month_year_less_than_or_equal=${Number(monthYear)}`
  //   }`
  // )
  // useEffect(() => {
  //   setCategories(
  //     Array.from(new Set(SlaTrendValues?.data?.map((item) => item.sla_svc_group) || [])).map(
  //       (sla_svc_group) => ({ sla_svc_group })
  //     )
  //   )
  // }, [setCategories, SlaTrendValues])
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const groupedDataPercentage = Array.from(
    new Map(
      graphValues?.data.map(
        ({
          request_type,
          requests_completed_within_sla____,
          requests_completed_beyond_sla____,
          requests_pending_within_sla____,
          requests_pending_beyond_sla____,
        }) => [
          request_type,
          {
            name: request_type,
            requests_completed_within_sla____,
            requests_completed_beyond_sla____,
            requests_pending_within_sla____,
            requests_pending_beyond_sla____,
          },
        ]
      )
    ).values()
  )

  const groupedDataNumber = Array.from(
    new Map(
      graphValues?.data.map(
        ({
          request_type,
          requests_completed_within_sla__count_,
          requests_completed_beyond_sla__count_,
          requests_pending_within_sla__count_,
          requests_pending_beyond_sla__count_,
        }) => [
          request_type,
          {
            name: request_type,
            requests_completed_within_sla__count_,
            requests_completed_beyond_sla__count_,
            requests_pending_within_sla__count_,
            requests_pending_beyond_sla__count_,
          },
        ]
      )
    ).values()
  )

  const groupedData = toggleValue ? groupedDataNumber : groupedDataPercentage

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

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

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
            <DataShowIcon />
          </button>
          <button
            className={`flex w-full border px-2 py-4 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <TrendIcon />
          </button>
          <button
            className={`flex w-full border px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <Top10Icon />
          </button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </button>
          <button
            className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </button>
        </div>
        {selectedLevel === 1 && (
          <div className='flex w-11/12 flex-row gap-4 p-2'>
            <div className='w-full rounded-lg bg-white p-4'>
              <div>
                {isLoading ? (
                  <Skeleton
                    height={100}
                    width='100%'
                  />
                ) : (
                  <div>
                    <button
                      className='small-1stop mb-auto cursor-pointer justify-end'
                      onClick={handleToogleNumber}
                    >
                      {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
                    </button>
                    <ResponsiveContainer
                      width='100%'
                      height={200}
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
                        <Tooltip
                          formatter={(value: number) =>
                            toggleValue ? formatNumber(value) : `${value.toFixed(2)}%`
                          }
                        />
                        <Bar
                          dataKey={
                            toggleValue
                              ? 'requests_completed_within_sla__count_'
                              : 'requests_completed_within_sla____'
                          }
                          stackId='a'
                          fill='#1b50b3'
                        />

                        <Bar
                          dataKey={
                            toggleValue
                              ? 'requests_pending_within_sla__count_'
                              : 'requests_pending_within_sla____'
                          }
                          stackId='a'
                          fill='#76a5ff'
                        />
                        <Bar
                          dataKey={
                            toggleValue
                              ? 'requests_completed_beyond_sla__count_'
                              : 'requests_completed_beyond_sla____'
                          }
                          stackId='a'
                          fill='#E3FE3C'
                        />
                        <Bar
                          dataKey={
                            toggleValue
                              ? 'requests_pending_beyond_sla__count_'
                              : 'requests_pending_beyond_sla____'
                          }
                          stackId='a'
                          fill='#EA5BA5'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedLevel === 2 && (
          <SlaTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            categories={categories}
            setCategories={setCategories}
          />
        )}
        {selectedLevel === 3 && (
          <SlaList
            column1='State'
            column2='Requests within SLA count'
            subset_id='82'
            default_level='state'
            categories={categories}
          />
        )}
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-button-muted px-4 pl-14'>
        <div className='w-1/3 py-4'>
          <p className='h3-1stop'>SLA Performance by Request Type</p>
        </div>
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
          <Link
            href={`/data-explorer/SLA Performance Comparison?latest=month?route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default SlaPerformance
