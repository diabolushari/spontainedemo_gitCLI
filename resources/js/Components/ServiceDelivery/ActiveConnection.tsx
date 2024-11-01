import React from 'react'
import InactiveGraph from './Graphs/InactiveGraph'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import MoreButton from '../MoreButton'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface InactiveGraphValues {
  conn_status_code: string
  consumer_count: number
  data_date: string
  consumer_category: string
}

const ActiveConnection = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<InactiveGraphValues>(`subset/17?${levelName}=${levelCode}`)

  const totalConnections = graphValues.reduce((sum, value) => sum + value.consumer_count, 0)

  const totalDomesticConnections = graphValues
    .filter((value) => value.consumer_category === 'DOMESTIC')
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const totalNonDomesticConnections = graphValues
    .filter((value) => value.consumer_category !== 'DOMESTIC')
    .reduce((sum, value) => sum + value.consumer_count, 0)

  const nonDomestic = graphValues.filter(
    (value) => value.consumer_category !== 'DOMESTIC' && value.consumer_category !== null
  )

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + ' M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K'
    }
    return value.toString()
  }

  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='flex w-full flex-col space-x-1 sm:flex-row'>
        <div className='flex w-1/2 flex-col gap-12 pt-3'>
          <div className='flex flex-col'>
            <p className='xlmetric-1stop'>{formatNumber(totalConnections)}</p>
            <p className='small-1stop-header'>Total Active Connections</p>
          </div>
          <div className='flex flex-row space-x-4'>
            <div className='flex flex-col'>
              <p className='mdmetric-1stop'>{formatNumber(totalDomesticConnections)}</p>
              <p className='small-1stop-header'>DOMESTIC</p>
            </div>
            <div className='flex flex-col'>
              <p className='mdmetric-1stop'>{formatNumber(totalNonDomesticConnections)}</p>
              <p className='small-1stop-header'>OTHERS</p>
            </div>
          </div>
        </div>
        <div className='mt-4 flex w-1/2 flex-col gap-2'>
          <InactiveGraph
            section_code={section_code}
            graphValues={nonDomestic}
          />
          <p className='small-1stop-header text-center'>Conn. Categories (non Domestic)</p>

          <div className='small-1stop-header mt-2 text-right'>
            {graphValues.length > 0 && graphValues[0].data_date}
          </div>
        </div>
      </div>
      <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
        <MoreButton />
      </div>
    </Card>
  )
}
export default ActiveConnection
