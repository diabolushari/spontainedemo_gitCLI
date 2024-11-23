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
import { OfficeInfo } from '@/interfaces/dashboard_accordion'
import useFetchRecord from '@/hooks/useFetchRecord'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import { Model } from '@/interfaces/data_interfaces'
import { monthList } from '@/libs/dates'

interface ComplaintValues extends Model {
  complaint_count: number
  complaint_type: string
  month_year: string
}

const PowerInterruptionTrend = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [monthYear, setMonthYear] = useState('')
  const [selectedRange, setSelectedRange] = useState('1')
  const [selectedLevel, setSelectedLevel] = useState(1)

  const [graphValues] = useFetchRecord<{ data: ComplaintValues[] }>(`subset/72?latest=month_year`)
  useEffect(() => {
    if (selectedMonth != null) {
      setMonthYear(
        `${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
      )
    }
  }, [selectedMonth])

  const chartData = graphValues?.data.filter((value) => value.month_year == monthYear)

  const referenceData = graphValues?.data.filter(
    (value) =>
      Number(value.month_year) >= Number(monthYear) - Number(selectedRange) &&
      Number(value.month_year) < Number(monthYear)
  )

  const dateEarlier: { name: string; value: number }[] = [
    { name: 'PREVIOUS MONTH', value: 1 },
    { name: '2 MONTHS', value: 2 },
    { name: '3 MONTHS', value: 3 },
    { name: '4 MONTHS', value: 4 },
    { name: '5 MONTHS', value: 5 },
    { name: '6 MONTHS', value: 6 },
    { name: '7 MONTHS', value: 7 },
    { name: '8 MONTHS', value: 8 },
    { name: '9 MONTHS', value: 9 },
    { name: '10 MONTHS', value: 10 },
    { name: '11 MONTHS', value: 11 },
    { name: '12 MONTHS', value: 12 },
  ]
  const comparedData = useMemo(() => {
    return [
      {
        name: 'Power Failures',
        current:
          chartData?.find((value) => value.complaint_type == 'NO POWER SUPPLY')?.complaint_count ??
          0,
        previous: referenceData
          ?.filter((value) => value.complaint_type == 'NO POWER SUPPLY')
          ?.reduce((sum, value) => sum + value.complaint_count, 0),
      },
      {
        name: 'Voltage Related',
        current:
          chartData?.find((value) => value.complaint_type == 'VOLTAGE RELATED')?.complaint_count ??
          0,
        previous: referenceData
          ?.filter((value) => value.complaint_type == 'VOLTAGE RELATED')
          ?.reduce((sum, value) => sum + value.complaint_count, 0),
      },
      {
        name: 'Service Connection Related',
        current:
          chartData?.find((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
            ?.complaint_count ?? 0,
        previous: referenceData
          ?.filter((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
          ?.reduce((sum, value) => sum + value.complaint_count, 0),
      },
    ]
  }, [chartData, referenceData])
  const isLoading = !graphValues || graphValues?.data.length === 0

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full flex-col'>
        <div className='flex w-full'>
          <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
            <div
              className={`rounded-tl-2xl border p-5 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.region_code ?? '')
                setSelectedLevel(1)
              }}
            >
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
            <div
              className={`border p-5 ${selectedLevel === 'RG' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.region_code ?? '')
                // setSelectedLevel('RG')
              }}
            ></div>
            <div
              className={`border p-5 ${selectedLevel === 'CR' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.circle_code ?? '')
                // setSelectedLevel('CR')
              }}
            ></div>
            <div
              className={`border p-5 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('office_code')
                // setLevelCode(level?.record.division_code ?? '')
                // setSelectedLevel('DV')
              }}
            ></div>
            <div
              className={`border p-5 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
              onClick={() => {
                // setLevelName('section_code')
                // setLevelCode(level?.record.section_code ?? '')
                // setSelectedLevel('SD')
              }}
            ></div>
          </div>
          <div className='flex w-11/12 flex-col gap-4 p-2'>
            <div className='flex'>
              <span className='small-1stop ml-10 items-end p-5'>
                {selectedMonth !== null && (
                  <>
                    Complaint volumes for{' '}
                    {monthList.find((value) => value.id == selectedMonth.getMonth() + 1)?.name},
                    {selectedMonth.getFullYear()} compared with..
                  </>
                )}
              </span>
              <div>
                <SelectList
                  list={dateEarlier ?? []}
                  dataKey='value'
                  displayKey='name'
                  value={selectedRange}
                  setValue={setSelectedRange}
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
                    <Legend formatter={(value) => <span className='text-black'>{value}</span>} />
                    <Tooltip />
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

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Complaint Types: Comparitive</p>
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
          <Link href='/dataset/17'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default PowerInterruptionTrend
