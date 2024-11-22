import React, { useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import ToogleNumber from '../ui/ToogleNumber'
import TooglePercentage from '../ui/TogglePercentage'
import DatePicker from '@/ui/form/DatePicker'

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

  const [selectedDate, setSelectedDate] = useState<string>('2024-09-30')

  console.log(selectedDate)
  console.log(setSelectedDate)

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const [graphValues] = useFetchList<PendencyGraphValues>(`subset/67?data_date=${selectedDate}`)
  console.log(graphValues)
  const lessThan5Days = toggleValue
    ? graphValues.find((value) => value.category === title)?.compl_perc_lt_5_days || 0
    : graphValues.find((value) => value.category === title)?.compl_cnt_lt_5_days || 0

  const betweem515Days = toggleValue
    ? graphValues.find((value) => value.category === title)?.compl_perc_5_15_days || 0
    : graphValues.find((value) => value.category === title)?.compl_cnt_5_15_days || 0
  const betweem1630Days = toggleValue
    ? graphValues.find((value) => value.category === title)?.compl_perc_16_30_days || 0
    : graphValues.find((value) => value.category === title)?.compl_cnt_16_30_days || 0
  const greaterThan30Days = toggleValue
    ? graphValues.find((value) => value.category === title)?.compl_perc_gt_30_days || 0
    : graphValues.find((value) => value.category === title)?.compl_cnt_gt_30_days || 0
  const complWithinSLa = toggleValue
    ? graphValues.find((value) => value.category === title)?.compl_within_sla_perc || 0
    : graphValues.find((value) => value.category === title)?.compl_within_sla_cnt || 0

  const data = [{ name: 'days', lessThan5Days, betweem515Days, betweem1630Days, greaterThan30Days }]

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex h-full w-1/12 flex-col rounded-2xl'>
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
        <div className='flex w-11/12 flex-row gap-4 p-2'>
          <div className='flex w-full flex-col gap-4 rounded-lg bg-white p-4'>
            <div className='mt-1 flex flex-col items-start justify-start md:flex-row'>
              <div className='flex'>
                <div className='flex flex-col p-5 pt-0'>
                  <span className='h3-1stop'>
                    {toggleValue ? `${complWithinSLa.toFixed(2)}%` : complWithinSLa}
                  </span>
                  <span className='small-1stop text-nowrap'>Compl. within SLA</span>
                </div>
                <div className='w-full md:w-2/3'>
                  <SelectList
                    setValue={setTitle}
                    list={graphValues}
                    displayKey='category'
                    dataKey='category'
                    showAllOption
                    value={title}
                    style='1stop'
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

            <div className='mt-4 flex flex-col gap-1'>
              <p className='small-1stop'>
                Request Completion {toggleValue ? '%' : ''} by Days Taken
              </p>

              <div className='flex justify-center p-5'>
                <BarChart
                  width={300}
                  height={60}
                  data={data}
                  layout='vertical'
                >
                  <Tooltip formatter={(value: number) => value.toFixed(2)} />
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
                  {toggleValue ? `${lessThan5Days.toFixed(2)}%` : lessThan5Days}
                </div>
                <div className='small-1stop'>{'<5 days'}</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>
                  {toggleValue ? `${betweem515Days.toFixed(2)}%` : betweem515Days}
                </div>
                <div className='small-1stop'>5-15 days</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>
                  {toggleValue ? `${betweem1630Days.toFixed(2)}%` : betweem1630Days}
                </div>
                <div className='small-1stop'>16-30 days</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>
                  {toggleValue ? `${greaterThan30Days.toFixed(2)}%` : greaterThan30Days}
                </div>
                <div className='small-1stop'>{'>30 days'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop text-wrap'>Pendancy Pattern</p>

        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
            new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} */}
          <DatePicker
            value={selectedDate}
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
