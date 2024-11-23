import React from 'react'
import MoreButton from '../MoreButton'
import { Link } from '@inertiajs/react'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}
interface Outage {
  month_begin_date: string
  scheduled_outage: number
  total_outages: number
  unscheduled_outage: number
  year_month: string
}
const Outages = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<Outage>(`subset/49?office_code=${levelCode}`)
  const isLoading = !graphValues || graphValues.length === 0
  const totalScheduled = graphValues.reduce((sum, value) => sum + value.scheduled_outage, 0)
  const totalUnscheduled = graphValues.reduce((sum, value) => sum + value.unscheduled_outage, 0)

  const scheduled = isLoading ? 0 : totalScheduled || 0
  const unscheduled = isLoading ? 0 : totalUnscheduled || 0

  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='flex w-full flex-col space-x-1 sm:flex-row'>
        <div className='flex'>
          <div className='ml-5 flex-col'>
            <p>{scheduled}</p>
            <p className='small-1stop-header mt-5'>AVERAGE MONTHLY </p>
            <p className='small-1stop-header'>OUTAGE DURATION </p>
            <p className='small-1stop-header'>(HOURS) </p>
          </div>
          <div className='ml-5 flex-col'>
            <p>{unscheduled}</p>
            <p className='small-1stop-header mt-5'> MONTHLY AVERAGE</p>
            <p className='small-1stop-header'>CONSUMERS AFFECTED </p>
          </div>
        </div>
      </div>
      {/* <div className='pl-5'>
        {isLoading ? (
          <Skeleton
            height={300}
            width='100%'
          />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={200}
          >
            <AreaChart data={graphValues}>
              <XAxis
                dataKey='day'
                hide
              />
              <YAxis hide />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='scheduled_outage'
                stroke='#0091ff'
                fill='#97C7E4'
              />
              <Area
                type='monotone'
                dataKey='unscheduled_outage'
                stroke='#0091ff'
                fill='#EA5BA5'
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div> */}
      <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href=''>
          <MoreButton />
        </Link>
      </div>
    </Card>
  )
}

export default Outages
