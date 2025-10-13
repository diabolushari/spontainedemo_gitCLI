import React, { useEffect, useMemo, useState } from 'react'
import Card from '@/ui/Card/Card'
import MoreButton from '../MoreButton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SelectList from '@/ui/form/SelectList'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}
interface Power {
  month_begin_date: string
  scheduled_outage: number
  section_code: string
  section_name: string
  total_outages: number
  unscheduled_outage: number
  year_month: string
}

// const yearList = [
//   {
//     name: '2024',
//     value: '202401,202402,202403,202404,202405,202406,202407,202408,202409,202410,202411,202412',
//   },
//   {
//     name: '2023',
//     value: '202301,202302,202303,202304,202305,202306,202307,202308,202309,202310,202311,202312',
//   },
//   {
//     name: '2022',
//     value: '202201,202202,202203,202204,202205,202206,202207,202208,202209,202210,202211,202212',
//   },
//   {
//     name: '2021',
//     value: '202101,202102,202103,202104,202105,202106,202107,202108,202109,202110,202111,202112',
//   },
//   {
//     name: '2020',
//     value: '202001,202002,202003,202004,202005,202006,202007,202008,202009,202010,202011,202012',
//   },
// ]
const PowerOutages = ({ section_code, levelName, levelCode }: Properties) => {
  const [yearList, setYearList] = useState<{ yearName: string; yearNumber: string }[]>([])
  const [yearFilter, setYearFilter] = useState(
    '202401,202402,202403,202404,202405,202406,202407,202408,202409,202410,202411,202412'
  )
  useEffect(() => {
    for (let i = new Date().getFullYear(); i >= 2017; i--) {
      setYearList((prev) => [
        ...prev,
        {
          yearName: `${i}`,
          yearNumber: `${i}01,${i}02,${i}03,${i}04,${i}05,${i}06,${i}07,${i}08,${i}09,${i}10,${i}11,${i}12`,
        },
      ])
    }
    const i = new Date().getFullYear()
    setYearFilter(
      `${i}01,${i}02,${i}03,${i}04,${i}05,${i}06,${i}07,${i}08,${i}09,${i}10,${i}11,${i}12`
    )
  }, [])

  const [graphValues] = useFetchList<Power>(
    `subset/48?office_code=${levelCode}&year_month_in=${yearFilter}`
  )

  const isLoading = !graphValues || graphValues.length === 0

  const totalOutages = graphValues.reduce((sum, value) => sum + value.total_outages, 0)
  const totalScheduled = graphValues.reduce((sum, value) => sum + value.scheduled_outage, 0)
  const totalUnscheduled = graphValues.reduce((sum, value) => sum + value.unscheduled_outage, 0)

  const outages = isLoading ? 0 : totalOutages || 0
  const scheduled = isLoading ? 0 : totalScheduled || 0
  const unscheduled = isLoading ? 0 : totalUnscheduled || 0

  const groupedData = Array.from(
    new Map(
      graphValues.map(({ month_begin_date, scheduled_outage, unscheduled_outage }) => [
        month_begin_date,
        {
          name: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          scheduled_outage,
          unscheduled_outage,
        },
      ])
    ).values()
  )
  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            style={{ marginRight: 10, color: 'black' }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 5,
              }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <Card className='flex w-2/3 space-x-1 p-4'>
      <div className='flex w-1/3 flex-col justify-center space-x-1 sm:flex-row'>
        <div className='flex flex-col items-center gap-12 pt-3'>
          <p className='subheader-1stop text-center'>POWER OUTAGES</p>
          <div className='flex flex-col pt-10'>
            <p className='xlmetric-1stop text-center'>{formatNumber(outages)}</p>
            <p className='1stop-small-header text-center'>TOTAL OUTAGES </p>
          </div>
          <div className='flex'>
            <div className='flex flex-col'>
              <p className='h3-1stop text-center'>{formatNumber(scheduled)}</p>
              <p className='small-1stop text-center'>SCHEDULED</p>
            </div>
            <div className='flex flex-col'>
              <p className='h3-1stop ml-5 text-center'>{formatNumber(unscheduled)}</p>
              <p className='small-1stop ml-5 text-center'>UNSCHEDULED</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-2/3 flex-col pt-10'>
        <div className='flex justify-end pr-8'>
          <div className='flex min-w-28 flex-col'>
            <SelectList
              setValue={setYearFilter}
              list={yearList}
              displayKey='yearName'
              dataKey='yearNumber'
              value={yearFilter}
              style='1stop'
            />
          </div>
        </div>
        {isLoading ? (
          <Skeleton
            height={400}
            width='100%'
          />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={400}
          >
            <BarChart
              data={groupedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='name'
                // tick={<CustomTick />}
                height={80}
                interval={0}
              />
              <YAxis hide />
              <Tooltip />
              <Bar
                dataKey='scheduled_outage'
                stackId='a'
                fill='#1b50b3'
              />
              <Bar
                dataKey='unscheduled_outage'
                stackId='a'
                fill='#76a5ff'
              />
              <Legend content={renderLegend} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className='flex w-full justify-end hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/49'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
export default PowerOutages
