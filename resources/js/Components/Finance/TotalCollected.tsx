import React from 'react'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import MoreButton from '../MoreButton'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface TotalCollectedValues {
  data_date: string
  total_collection: number
  voltage: string
}

const TotalCollected = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<TotalCollectedValues>(`subset/35?${levelName}=${levelCode}`)
  console.log(graphValues)

  const totalCollected = graphValues.reduce((sum, item) => sum + item.total_collection, 0)

  const ltAll = graphValues.find((item) => item.voltage === 'LT')?.total_collection || 0
  const ehtAll = graphValues.find((item) => item.voltage === 'EHT')?.total_collection || 0
  const htAll = graphValues.find((item) => item.voltage === 'HT')?.total_collection || 0

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
        {isLoading ? <Skeleton /> : formatNumber(totalCollected)}
      </div>
      <p className='body-1stop mb-4'>Total Collected</p>

      {/* Display LT-ALL */}
      <div className='mb-4 grid w-full text-left'>
        <div>
          <p className='h3-1stop'> {isLoading ? <Skeleton /> : formatNumber(ltAll)}</p>
          <p className='small-1stop'>LT-ALL</p>
        </div>
      </div>

      <div className='grid w-1/2 grid-cols-2 gap-2 text-left'>
        <div>
          <p className='h3-1stop'> {isLoading ? <Skeleton /> : formatNumber(ehtAll)}</p>
          <p className='small-1stop'>EHT - ALL</p>
        </div>
        <div>
          <p className='h3-1stop'> {isLoading ? <Skeleton /> : formatNumber(htAll)}</p>
          <p className='small-1stop'>HT - ALL</p>
        </div>
      </div>

      <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
        <MoreButton />
      </div>
    </Card>
  )
}

export default TotalCollected
