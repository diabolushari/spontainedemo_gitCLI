import React, { useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'

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
              <div className='w-full md:w-2/3'>
                <SelectList
                  setValue={setTitle}
                  list={graphValues}
                  displayKey='service_group'
                  dataKey='service_group'
                  showAllOption
                  value={title}
                  style='1stop'
                />
              </div>
            </div>

            <div className='mt-4 flex flex-col gap-1'>
              <p className='subheader-sm-1stop'>Requests Pending beyond SLA</p>

              <div className='flex justify-center'>
                <BarChart
                  width={300}
                  height={60}
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
              </div>
            </div>
            <div className='grid grid-cols-2 justify-center gap-2 md:justify-start md:gap-5'>
              <div className='text-center'>
                <div className='smmetric-1stop'>{lessThan5Days}</div>
                <div className='small-1stop'>{'<5 days'}</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>{betweem515Days}</div>
                <div className='small-1stop'>5-15 days</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>{betweem1630Days}</div>
                <div className='small-1stop'>16-30 days</div>
              </div>
              <div className='text-center'>
                <div className='smmetric-1stop'>{greaterThan30Days}</div>
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
          <MonthPicker />
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
