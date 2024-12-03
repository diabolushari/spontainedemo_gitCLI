import useFetchList from '@/hooks/useFetchList'
import React, { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LabelList,
} from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import Card from '@/ui/Card/Card'
import useFetchRecord from '@/hooks/useFetchRecord'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import { Model } from '@/interfaces/data_interfaces'
import { monthList } from '@/libs/dates'
import { formatNumber } from './ActiveConnection'
import DataShowIcon from '../ui/DatashowIcon'

interface ComplaintValues extends Model {
  complaint_count: number
  complaint_type: string
  month_year: string
}

const PowerInterruptionTrend = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [monthYear, setMonthYear] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [yearList, setYearList] = useState<{ yearName: string }[]>([])
  const [graphValues] = useFetchRecord<{ latest_value: string }>(`subset/72?latest=month_year`)
  const [yearFilter, setYearFilter] = useState('')
  const [referenceMonthYear, setReferenceMonthYear] = useState('')
  const [selectedRange, setSelectedRange] = useState('')
  useEffect(() => {
    setSelectedRange(`${(Number(graphValues?.latest_value) % 100) - 1}`)
    setReferenceMonthYear(`${Number(graphValues?.latest_value) - 1}`)
    setYearFilter(`${Math.trunc(Number(graphValues?.latest_value) / 100)}`)
  }, [graphValues?.latest_value])

  useEffect(() => {
    setReferenceMonthYear(
      Number(selectedRange) < 10 ? yearFilter + '0' + selectedRange : yearFilter + selectedRange
    )
  }, [setReferenceMonthYear, selectedRange, yearFilter])
  useEffect(() => {
    for (let i = new Date().getFullYear(); i >= 2017; i--) {
      setYearList((prev) => [
        ...prev,
        {
          yearName: `${i}`,
        },
      ])
    }
    const i = new Date().getFullYear()
    setYearFilter(`${i}`)
  }, [])

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  useEffect(() => {
    if (selectedMonth != null) {
      setMonthYear(
        `${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
      )
    }
  }, [selectedMonth])

  const [chartData] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?month_year=${monthYear}`
  )

  const [referenceData] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?month_year=${referenceMonthYear}`
  )

  const comparedData = useMemo(() => {
    return [
      {
        name: 'Power Failures',
        current:
          chartData?.data.find((value) => value.complaint_type == 'NO POWER SUPPLY')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'NO POWER SUPPLY')
            ?.complaint_count ?? 0,
      },
      {
        name: 'Voltage Related',
        current:
          chartData?.data.find((value) => value.complaint_type == 'VOLTAGE RELATED')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'VOLTAGE RELATED')
            ?.complaint_count ?? 0,
      },
      {
        name: 'Service Connection Related',
        current:
          chartData?.data.find((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
            ?.complaint_count ?? 0,
      },
    ]
  }, [chartData, referenceData])

  const isLoading = !chartData || chartData?.data.length === 0

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full flex-col'>
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
              className={`border px-2 py-7 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.region_code ?? '')
                // setSelectedLevel('RG')
              }}
            ></button>
            <button
              className={`border px-2 py-7 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.circle_code ?? '')
                // setSelectedLevel('CR')
              }}
            ></button>
            <button
              className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.division_code ?? '')
                // setSelectedLevel('DV')
              }}
            ></button>
            <button
              className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('section_code')
                // setLevelCode(level?.record.section_code ?? '')
                // setSelectedLevel('SD')
              }}
            ></button>
          </div>
          <div className='flex w-11/12 flex-col gap-4 p-2'>
            <div className='flex items-center gap-2'>
              <span className='subheader-sm-1stop items-end'>
                {selectedMonth !== null && (
                  <>
                    Complaint volumes for{' '}
                    {monthList.find((value) => value.id == selectedMonth.getMonth() + 1)?.name},
                    {selectedMonth.getFullYear()} compared with..
                  </>
                )}
              </span>
              <div className=''>
                <SelectList
                  setValue={setYearFilter}
                  list={yearList}
                  displayKey='yearName'
                  dataKey='yearName'
                  value={yearFilter}
                  style='1stop-small'
                />
              </div>
              <div>
                <SelectList
                  list={monthList}
                  dataKey='id'
                  displayKey='name'
                  value={selectedRange}
                  setValue={setSelectedRange}
                  style='1stop-small'
                />
              </div>
            </div>
            <div className='w-full'>
              {isLoading ? (
                <Skeleton
                  height={200}
                  width='100%'
                />
              ) : (
                <ResponsiveContainer
                  height={200}
                  width={'100%'}
                >
                  <BarChart
                    layout='vertical'
                    width={600}
                    height={600}
                    data={comparedData}
                  >
                    <XAxis
                      type='number'
                      axisLine={false}
                      display='none'
                      padding={{ left: 0, right: 0 }}
                    />
                    <YAxis
                      type='category'
                      axisLine={false}
                      display='none'
                      height={10}
                      width={120}
                      dataKey='name'
                      padding={{ top: 50 }}
                    />
                    <Legend
                      formatter={(value) => {
                        if (value === 'current' && selectedMonth) {
                          const currentMonthName = monthList.find(
                            (m) => m.id === selectedMonth.getMonth() + 1
                          )?.name
                          const currentYear = selectedMonth.getFullYear()
                          return `${currentMonthName}, ${currentYear}`
                        }

                        if (value === 'previous') {
                          const previousMonthName = monthList.find(
                            (m) => m.id === Number(selectedRange)
                          )?.name
                          return `${previousMonthName}, ${yearFilter}`
                        }

                        return value
                      }}
                    />

                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'current' && selectedMonth) {
                          const currentMonthName = monthList.find(
                            (m) => m.id === selectedMonth.getMonth() + 1
                          )?.name
                          const currentYear = selectedMonth.getFullYear()
                          return [`${formatNumber(value)} `, `${currentMonthName}, ${currentYear}`]
                        }

                        if (name === 'previous') {
                          const previousMonthName = monthList.find(
                            (m) => m.id === Number(selectedRange)
                          )?.name
                          return [`${formatNumber(value)} `, `${previousMonthName}, ${yearFilter}`]
                        }

                        return [formatNumber(value), name]
                      }}
                    />

                    <Bar
                      dataKey='current'
                      fill={'#1b50b3'}
                      barSize={30}
                    >
                      <LabelList
                        dataKey='name'
                        position='left'
                        fill='#262626'
                        fontSize={10}
                        dx={-10}
                      />
                    </Bar>
                    <Bar
                      dataKey='previous'
                      fill={'#76a5ff'}
                      barSize={30}
                    ></Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-button-muted px-4 pl-14'>
        <div className='w-1/3 py-4'>
          <p className='h3-1stop'>Complaint Types: Comparitive</p>
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
            href={`/data-explorer/Complaint Volumes Comparison?latest=month&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default PowerInterruptionTrend
