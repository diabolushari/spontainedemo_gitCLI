import React, { useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface PendencyGraphValues {
  data_date: string
  cnt_lt_5day: number
  cnt_5_15day: number
  cnt_16_30day: number
  cnt_gt_30day: number
  service_group: string
}

const PendancyCard = ({ section_code, levelName, levelCode }: Properties) => {
  const [title, setTitle] = useState('All Categories')
  const [graphValues] = useFetchList<PendencyGraphValues>(`subset/28?office_code=${levelCode}`)

  const sumValues = graphValues.reduce(
    (acc, value) => {
      acc.cnt_lt_5day += value.cnt_lt_5day
      acc.cnt_5_15day += value.cnt_5_15day
      acc.cnt_16_30day += value.cnt_16_30day
      acc.cnt_gt_30day += value.cnt_gt_30day
      return acc
    },
    { cnt_lt_5day: 0, cnt_5_15day: 0, cnt_16_30day: 0, cnt_gt_30day: 0 }
  )

  const selectedValues =
    title === 'All Categories'
      ? sumValues
      : graphValues.find((value) => value.service_group === title) || {
          cnt_lt_5day: 0,
          cnt_5_15day: 0,
          cnt_16_30day: 0,
          cnt_gt_30day: 0,
        }

  const lessThan5Days = selectedValues.cnt_lt_5day
  const betweem515Days = selectedValues.cnt_5_15day
  const betweem1630Days = selectedValues.cnt_16_30day
  const greaterThan30Days = selectedValues.cnt_gt_30day

  const data = [{ name: 'days', lessThan5Days, betweem515Days, betweem1630Days, greaterThan30Days }]
  const isLoading = !graphValues || graphValues.length === 0

  return (
    <div className='rounded-lg bg-white p-4 md:p-6'>
      <div className='pl-6 pt-4 text-lg font-bold md:pl-10 md:pt-10 md:text-xl'>
        PENDENCY BEYOND SLA
      </div>

      <div className='flex w-1/2 flex-col justify-end p-4 md:flex-row md:justify-end md:p-2'>
        {isLoading ? (
          <Skeleton
            height={50}
            width={200}
          />
        ) : (
          <SelectList
            setValue={setTitle}
            list={[{ service_group: 'All Categories' }, ...graphValues]}
            displayKey='service_group'
            dataKey='service_group'
            value={title}
            className='w-full md:w-48'
          />
        )}
      </div>

      <div className='body-1stop pl-6 pt-4 text-center md:pl-10 md:pt-10 md:text-left'>
        Requests Pending beyond SLA
      </div>

      <div className='flex justify-center p-4 md:p-5'>
        {isLoading ? (
          <Skeleton
            height={100}
            width={300}
          />
        ) : (
          <BarChart
            width={300}
            height={100}
            data={data}
            layout='vertical'
          >
            <Tooltip />
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
        )}
      </div>

      <div className='flex flex-row flex-nowrap justify-center gap-4 pl-6 md:justify-start md:gap-10 md:pl-14'>
        <div className='text-center'>
          <div className='text-xl font-semibold'>
            {isLoading ? <Skeleton width={40} /> : lessThan5Days}
          </div>
          <div className='small-1stop'>{'<5 days'}</div>
        </div>
        <div className='text-center'>
          <div className='text-xl font-semibold'>
            {isLoading ? <Skeleton width={40} /> : betweem515Days}
          </div>
          <div className='small-1stop'>5-15 days</div>
        </div>
        <div className='text-center'>
          <div className='text-xl font-semibold'>
            {isLoading ? <Skeleton width={40} /> : betweem1630Days}
          </div>
          <div className='small-1stop'>16-30 days</div>
        </div>
        <div className='text-center'>
          <div className='text-xl font-semibold'>
            {isLoading ? <Skeleton width={40} /> : greaterThan30Days}
          </div>
          <div className='small-1stop'>{'>30 days'}</div>
        </div>
      </div>

      <div className='mt-4 flex w-full justify-end p-4 hover:cursor-pointer hover:opacity-50'>
        <MoreButton />
      </div>
    </div>
  )
}

export default PendancyCard
