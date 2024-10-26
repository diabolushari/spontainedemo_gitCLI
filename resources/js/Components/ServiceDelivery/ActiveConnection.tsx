import React, { useMemo } from 'react'
import InactiveGraph from './Graphs/InactiveGraph'
import Card from '@/ui/Card/Card'
import useFetchList from '@/hooks/useFetchList'
import { Model } from '@/interfaces/data_interfaces'
interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface InactiveGraphValues {
  conn_status_code: string
  consumer_count: number
  data_date: string
  section_code: string
  section_name: string
  voltage: string
}
const ActiveConnection = ({ section_code, levelName, levelCode }: Properties) => {
  console.log(`subset/12?office_code=${levelCode}`)
  const [graphValues] = useFetchList<InactiveGraphValues>(`subset/12?office_code=${levelCode}`)

  const activeConnection = useMemo(() => {
    let activeSum = 0
    graphValues.forEach((graphValue) => {
      if (
        graphValue.conn_status_code === 'CN' ||
        graphValue.conn_status_code === 'DC' ||
        graphValue.conn_status_code === 'NU'
      ) {
        activeSum = activeSum + graphValue.consumer_count
      }
    })

    return activeSum
  }, [graphValues])
  const LTConnection = useMemo(() => {
    let LTSum = 0
    graphValues.forEach((graphValue) => {
      if (graphValue.voltage === 'LT') {
        LTSum = LTSum + graphValue.consumer_count
      }
    })
    return LTSum
  }, [graphValues])

  const HTConnection = useMemo(() => {
    let HTSum = 0
    graphValues.forEach((graphValue) => {
      if (graphValue.voltage === 'HT') {
        HTSum = HTSum + graphValue.consumer_count
      }
    })
    return HTSum
  }, [graphValues])

  return (
    <Card className='relative flex h-full grid-cols-2 gap-4 p-10'>
      <div className='flex w-full flex-col'>
        <div className='h1-1stop'>{activeConnection}</div>
        <div className='body-1stop'>Total Active Connections</div>
        <div className='flex gap-2'>
          <div className='flex flex-col'>
            {' '}
            <div className='h3-1stop'>{LTConnection}</div>
            <div className='small-1stop'>LT</div>
          </div>
          <div className='flex flex-col'>
            {' '}
            <div className='h3-1stop'>{HTConnection}</div>
            <div className='small-1stop'>HT</div>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col gap-4 p-5'>
        <div className='h3-1stop flex justify-end'>Inactive A/c Statuses</div>
        <div className='flex-cols-2 flex gap-5'>
          <div className='flex flex-col'>
            <InactiveGraph
              section_code={section_code}
              graphValues={graphValues}
            />
            <hr className='my-4 border-t border-black' />
          </div>
        </div>
        <div className='small-1stop-header absolute bottom-0 right-10 pb-2 text-right'>
          {graphValues.length > 0 && graphValues[0].data_date}
        </div>
      </div>
    </Card>
  )
}
export default ActiveConnection
