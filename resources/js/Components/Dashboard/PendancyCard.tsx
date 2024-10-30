import React, { useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import { Legend } from '@headlessui/react'

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
  const [title, setTitle] = useState('Load Change')
  const [graphValues] = useFetchList<PendencyGraphValues>(`subset/28?office_code=${levelCode}`)

  const lessThan5Days = graphValues.find((value) => value.service_group === title)?.cnt_lt_5day || 0
  const betweem515Days =
    graphValues.find((value) => value.service_group === title)?.cnt_5_15day || 0
  const betweem1630Days =
    graphValues.find((value) => value.service_group === title)?.cnt_16_30day || 0
  const greaterThan30Days =
    graphValues.find((value) => value.service_group === title)?.cnt_gt_30day || 0

  const data = [{ name: 'days', lessThan5Days, betweem515Days, betweem1630Days, greaterThan30Days }]
  return (
    <div className='rounded-lg bg-white p-4'>
      <div className='h3-1stop pl-10 pt-10'>PENDENCY BEYOND SLA</div>
      <div className='flex w-full flex-col gap-2 p-2'>
        <div className='flex justify-end'>
          <div className='mr-7 flex w-48 flex-col'>
            <SelectList
              setValue={setTitle}
              list={graphValues}
              displayKey='service_group'
              dataKey='service_group'
              label='ALL CATEGORIES'
              showAllOption
              value={title}
            />
          </div>
        </div>
      </div>
      <div className='body-1stop pl-10 pt-10'>Requests Pending beyond SLA</div>
      <div className='flex justify-center p-5'>
        <BarChart
          width={400}
          height={100}
          data={data}
          layout='vertical'
        >
          <Tooltip></Tooltip>
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
          ></Bar>
          <Bar
            dataKey='betweem515Days'
            stackId='a'
            fill='#EFF0A6'
          ></Bar>
          <Bar
            dataKey='betweem1630Days'
            stackId='a'
            fill='#E9BF7C'
          ></Bar>
          <Bar
            dataKey='greaterThan30Days'
            stackId='a'
            fill='#D467B3'
          ></Bar>
        </BarChart>
      </div>
      <div>
        <div className='flex'>
          <div className='h3-1stop ml-14'>{lessThan5Days}</div>
          <div className='h3-1stop ml-10'>{betweem515Days}</div>
          <div className='h3-1stop ml-10'>{betweem1630Days}</div>
          <div className='h3-1stop ml-10'>{greaterThan30Days}</div>
        </div>
        <div className='flex'>
          <div className='small-1stop ml-14'>{'<5 days'}</div>
          <div className='small-1stop ml-14'>5-15 days</div>
          <div className='small-1stop ml-12'>16-30 days</div>
          <div className='small-1stop ml-10'>{'>30 days'}</div>
        </div>
      </div>
      <div className='mb-auto flex w-full justify-end hover:cursor-pointer hover:opacity-50'>
        <MoreButton />
      </div>
    </div>
  )
}

export default PendancyCard
