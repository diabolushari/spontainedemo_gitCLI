import React from 'react'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface TotalBilledValues {
  consumer_category: string
  data_date: string
  voltage: string
  total_consumption: number
}

const TotalBilled = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchRecord<{ data: TotalBilledValues[] }>(
    `subset/43?${levelName}=${levelCode}`
  )

  const totalbilled = graphValues?.data.reduce((sum, item) => sum + item.total_consumption, 0)

  const domesticLT = graphValues?.data
    .filter((item) => item.consumer_category === 'DOMESTIC' && item.voltage === 'LT')
    .reduce((sum, item) => sum + item.total_consumption, 0)

  const otherLT = graphValues?.data
    .filter((item) => item.consumer_category !== 'DOMESTIC' && item.voltage === 'LT')
    .reduce((sum, item) => sum + item.total_consumption, 0)

  const ehtAll = graphValues?.data
    .filter((item) => item.voltage === 'EHT')
    .reduce((sum, item) => sum + item.total_consumption, 0)

  const htAll = graphValues?.data
    .filter((item) => item.voltage === 'HT')
    .reduce((sum, item) => sum + item.total_consumption, 0)

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + ' M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K'
    }
    return value.toString()
  }

  const isLoading = !graphValues || graphValues?.data.length === 0

  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='xlmetric-1stop mb-1'>
        ₹{isLoading ? <Skeleton /> : formatNumber(totalbilled ?? 0)}
      </div>
      <p className='body-1stop mb-4'>Total Billed</p>
      <div className='grid w-1/2 grid-cols-2 gap-2 text-left'>
        <div>
          <p className='h3-1stop'>₹{isLoading ? <Skeleton /> : formatNumber(domesticLT ?? 0)}</p>
          <p className='small-1stop'>DOMESTIC - LT</p>
        </div>
        <div>
          <p className='h3-1stop'>₹{isLoading ? <Skeleton /> : formatNumber(otherLT ?? 0)}</p>
          <p className='small-1stop'>OTHERS - LT</p>
        </div>
        <div>
          <p className='h3-1stop space-x-2'>
            ₹{isLoading ? <Skeleton /> : formatNumber(ehtAll ?? 0)}
          </p>
          <p className='small-1stop'>EHT - ALL</p>
        </div>
        <div>
          <p className='h3-1stop space-x-4'>
            ₹{isLoading ? <Skeleton /> : formatNumber(htAll ?? 0)}
          </p>
          <p className='small-1stop'>HT - ALL</p>
        </div>
      </div>
      <div className='mt-2 flex justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href='/dataset/44'>
          <MoreButton />
        </Link>
      </div>
    </Card>
  )
}
export default TotalBilled
