import React from 'react'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface TotalBilledValues {
  billed_consumers: number
  consumer_category: string
  data_date: string
  voltage: string
}

const TotalBilled = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<TotalBilledValues>(`subset/34?${levelName}=${levelCode}`)
  console.log(graphValues)

  const totalbilled = graphValues.reduce((sum, item) => sum + item.billed_consumers, 0)

  const domesticLT = graphValues
    .filter((item) => item.consumer_category === 'DOMESTIC' && item.voltage === 'LT')
    .reduce((sum, item) => sum + item.billed_consumers, 0)

  const otherLT = graphValues
    .filter((item) => item.consumer_category !== 'DOMESTIC' && item.voltage === 'LT')
    .reduce((sum, item) => sum + item.billed_consumers, 0)

  const ehtAll = graphValues
    .filter((item) => item.voltage === 'EHT')
    .reduce((sum, item) => sum + item.billed_consumers, 0)

  const htAll = graphValues
    .filter((item) => item.voltage === 'HT')
    .reduce((sum, item) => sum + item.billed_consumers, 0)

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + ' M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K'
    }
    return value.toString()
  }

  const isLoading = !graphValues || graphValues.length === 0

  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='xlmetric-1stop mb-1'>
        ₹{isLoading ? <Skeleton /> : formatNumber(totalbilled)}
      </div>
      <p className='body-1stop mb-4'>Total Billed</p>
      <div className='grid w-1/2 grid-cols-2 gap-2 text-left'>
        <div>
          <p className='h3-1stop'>₹{isLoading ? <Skeleton /> : formatNumber(domesticLT)}</p>
          <p className='small-1stop'>DOMESTIC - LT</p>
        </div>
        <div>
          <p className='h3-1stop'>₹{isLoading ? <Skeleton /> : formatNumber(otherLT)}</p>
          <p className='small-1stop'>OTHERS - LT</p>
        </div>
        <div>
          <p className='h3-1stop space-x-2'>₹{isLoading ? <Skeleton /> : formatNumber(ehtAll)}</p>
          <p className='small-1stop'>EHT - ALL</p>
        </div>
        <div>
          <p className='h3-1stop space-x-4'>₹{isLoading ? <Skeleton /> : formatNumber(htAll)}</p>
          <p className='small-1stop'>HT - ALL</p>
        </div>
      </div>
      <div className='mt-2 flex justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href='/dataset/41'>
          <MoreButton />
        </Link>
      </div>
    </Card>
  )
}
export default TotalBilled
