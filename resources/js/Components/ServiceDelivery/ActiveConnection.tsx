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
    <Card className='flex flex-col gap-5 overflow-hidden p-4 sm:flex-row sm:overflow-visible'>
      <div className='flex flex-col gap-5 p-5'>
        <div>
          <p className='xlmetric-1stop'>{formatNumber(totalConnections)}</p>
          <p className='body-1stop'>Total Active Connections</p>
        </div>
        <div className='flex flex-wrap gap-5'>
          <div className='flex flex-col'>
            <p className='h3-1stop'>{totalDomesticConnections}</p>
            <p className='small-1stop'>DOMESTIC</p>
          </div>
          <div className='flex flex-col'>
            <p className='h3-1stop'>{totalNonDomesticConnections}</p>
            <p className='small-1stop'>OTHERS</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 overflow-x-auto p-4 sm:overflow-visible'>
        <div className='body-1stop'>Conn. Categories (non Domestic)</div>
        <div className='flex flex-col gap-5'>
          <InactiveGraph
            section_code={section_code}
            graphValues={nonDomestic}
          />
        </div>
        <div className='small-1stop-header mt-2 text-right'>
          {graphValues.length > 0 && graphValues[0].data_date}
        </div>
        <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
          <MoreButton />
        </div>
      </div>
    </Card>
  )
}
export default ActiveConnection
