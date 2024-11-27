import React, { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from '@inertiajs/react'
import Card from '@/ui/Card/Card'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import DatePicker from '@/ui/form/DatePicker'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import { format } from 'path'

export interface PendencyGraphValues {
  category: string
  compl_cnt_5_15_days: number
  compl_cnt_16_30_days: number
  compl_cnt_gt_30_days: number
  compl_cnt_lt_5_days: number
  compl_perc_5_15_days: number
  compl_perc_16_30_days: number
  compl_perc_gt_30_days: number
  compl_perc_lt_5_days: number
  compl_within_sla_cnt: number
  compl_within_sla_perc: number
  data_date: string
}

const PendancyCard = () => {
  const [title, setTitle] = useState('Load Change')
  const [toggleValue, settoggleValue] = useState<boolean>(true)
  const [selectedLevel, setSelectedLevel] = useState(1)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }
  const [graphValues] = useFetchRecord<{
    data: PendencyGraphValues[]
    date: string
    latest_value: string
  }>(`/subset/67?${selectedDate == null ? 'latest=data_date' : `data_date=${selectedDate}`}`)
  useEffect(() => {
    if (selectedDate == null && graphValues != null) {
      setSelectedDate(graphValues.latest_value)
    }
  }, [setSelectedDate, graphValues, selectedDate])

  const lessThan5Days = toggleValue
    ? graphValues?.data.find((value) => value.category === title)?.compl_perc_lt_5_days || 0
    : graphValues?.data.find((value) => value.category === title)?.compl_cnt_lt_5_days || 0

  const betweem515Days = toggleValue
    ? graphValues?.data.find((value) => value.category === title)?.compl_perc_5_15_days || 0
    : graphValues?.data.find((value) => value.category === title)?.compl_cnt_5_15_days || 0
  const betweem1630Days = toggleValue
    ? graphValues?.data.find((value) => value.category === title)?.compl_perc_16_30_days || 0
    : graphValues?.data.find((value) => value.category === title)?.compl_cnt_16_30_days || 0
  const greaterThan30Days = toggleValue
    ? graphValues?.data.find((value) => value.category === title)?.compl_perc_gt_30_days || 0
    : graphValues?.data.find((value) => value.category === title)?.compl_cnt_gt_30_days || 0
  const complWithinSLa = toggleValue
    ? graphValues?.data.find((value) => value.category === title)?.compl_within_sla_perc || 0
    : graphValues?.data.find((value) => value.category === title)?.compl_within_sla_cnt || 0

  const data = [{ name: 'days', lessThan5Days, betweem515Days, betweem1630Days, greaterThan30Days }]

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/6 flex-col rounded-2xl'>
          <button
            className={`flex w-full rounded-tl-2xl border px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
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
          <div
            className={`border px-2 py-7 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
          ></div>
          <div
            className={`border px-2 py-7 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
          ></div>
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
        <div className='mx-2 flex w-full flex-row pt-6'>
          {selectedLevel === 1 && (
            <div className='flex w-full flex-col gap-4 rounded-lg bg-white p-4'>
              <div className='mt-1 flex flex-col items-start justify-start md:flex-row'>
                <div className='flex'>
                  <div className='flex flex-col p-5 pt-0'>
                    <span className='h3-1stop'>
                      {toggleValue ? `${complWithinSLa.toFixed(2)}%` : formatNumber(complWithinSLa)}
                    </span>
                    <span className='small-1stop text-nowrap'>Compl. within SLA</span>
                  </div>
                  <div className='w-full md:w-2/3'>
                    <SelectList
                      setValue={setTitle}
                      list={graphValues?.data ?? []}
                      displayKey='category'
                      dataKey='category'
                      showAllOption
                      value={title}
                    />
                  </div>
                  <div className='items-end'>
                    <button
                      className='small-1stop mb-auto cursor-pointer justify-end p-5'
                      onClick={handleToogleNumber}
                    >
                      {toggleValue ? <TooglePercentage /> : <ToogleNumber />}
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex flex-col pt-10'>
                <p className='small-1stop'>
                  Request Completion {toggleValue ? '%' : ''} by Days Taken
                </p>

                <div className='flex justify-center'>
                  <BarChart
                    width={300}
                    height={60}
                    data={data}
                    layout='vertical'
                  >
                    <Tooltip
                      formatter={
                        toggleValue
                          ? (value: number) => `${value.toFixed(2)}%`
                          : (value: number) => formatNumber(value)
                      }
                    />
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
                      fill='#A2B899'
                    />
                    <Bar
                      dataKey='betweem515Days'
                      stackId='a'
                      fill='#EFF0A6'
                    />
                    <Bar
                      dataKey='betweem1630Days'
                      stackId='a'
                      fill='#E9BF7C'
                    />
                    <Bar
                      dataKey='greaterThan30Days'
                      stackId='a'
                      fill='#D467B3'
                    />
                  </BarChart>
                </div>
              </div>
              <div className='grid grid-cols-4 justify-center gap-2 pb-5 md:justify-start md:gap-5'>
                <div className='text-center'>
                  <div className='smmetric-1stop'>
                    {toggleValue ? `${lessThan5Days.toFixed(2)}%` : formatNumber(lessThan5Days)}
                  </div>
                  <div className='small-1stop'>{'<5 days'}</div>
                </div>
                <div className='text-center'>
                  <div className='smmetric-1stop'>
                    {toggleValue ? `${betweem515Days.toFixed(2)}%` : formatNumber(betweem515Days)}
                  </div>
                  <div className='small-1stop'>5-15 days</div>
                </div>
                <div className='text-center'>
                  <div className='smmetric-1stop'>
                    {toggleValue ? `${betweem1630Days.toFixed(2)}%` : formatNumber(betweem1630Days)}
                  </div>
                  <div className='small-1stop'>16-30 days</div>
                </div>
                <div className='text-center'>
                  <div className='smmetric-1stop'>
                    {toggleValue
                      ? `${greaterThan30Days.toFixed(2)}%`
                      : formatNumber(greaterThan30Days)}
                  </div>
                  <div className='small-1stop'>{'>30 days'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex h-full items-center justify-between gap-1 rounded-b-2xl bg-button-muted px-4 pl-14'>
        <div className=''>
          <p className='h3-1stop'>Pendency Pattern</p>
        </div>
        <div className='small-1stop-header flex h-full items-center bg-1stop-accent2 px-4 py-4'>
          {/* {graphValues.length > 0 &&
            new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} */}
          <DatePicker
            value={selectedDate ?? ''}
            setValue={setSelectedDate}
          />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/39'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default PendancyCard
