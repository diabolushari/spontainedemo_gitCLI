import useFetchList from '@/hooks/useFetchList'
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface PowerInterruptionValues {
  request_date: string
  powerfailures: number
}

const PowerInterruptionTrend = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<PowerInterruptionValues>(`subset/33?${levelName}=${levelCode}`)
  const [chartData, setChartData] = useState<{ day: string; interruptions: number }[]>([])

  useEffect(() => {
    if (graphValues && graphValues.length > 0) {
      const sortedData = [...graphValues].sort(
        (a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
      )

      const formattedData = sortedData.map((item, index) => ({
        day: `Day ${index + 1}`,
        interruptions: item.powerfailures,
      }))

      setChartData(formattedData)
    }
  }, [graphValues])
  const isLoading = !graphValues || graphValues.length === 0
  return (
    <div className='w-full rounded-lg p-4'>
      <p className='h3-1stop mb-6'>10-day Power Interruption Trend</p>
      <div className='pl-5'>
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
            <AreaChart data={chartData}>
              <XAxis
                dataKey='day'
                hide
              />
              <YAxis hide />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='interruptions'
                stroke='#0091ff'
                fill='#0091ff'
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className='mt-4 flex items-end justify-end hover:cursor-pointer hover:opacity-50'>
        <Link
          href='/dataset/40'
          className='mt-6'
        >
          <MoreButton />
        </Link>
      </div>
    </div>
  )
}

export default PowerInterruptionTrend
