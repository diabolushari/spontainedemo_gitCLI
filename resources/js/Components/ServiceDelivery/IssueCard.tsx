import React from 'react'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

export interface IssueCardValues {
  line_issues: number
  powerfailures: number
  request_date: string
  svcwire_issues: number
  total_complaints: number
}

const IssueCard = ({ section_code, levelName, levelCode }: Properties) => {
  const [graphValues] = useFetchList<IssueCardValues>(`subset/29?${levelName}=${levelCode}`)
  const totalComplaints = graphValues[0]?.total_complaints || 0
  const powerFailure = graphValues[0]?.powerfailures || 0
  const serviceWireIssue = graphValues[0]?.svcwire_issues || 0
  const lineFault = graphValues[0]?.line_issues || 0

  const isLoading = !graphValues || graphValues.length === 0

  return (
    <div className='flex flex-col items-center rounded-lg'>
      <div className='grid w-full max-w-md grid-cols-2 gap-4 p-6'>
        <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
          <div className='h2-1stop'>{isLoading ? <Skeleton width={60} /> : totalComplaints}</div>
          <div className='body-1stop'>Total Complaints</div>
        </div>
        <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
          <div className='h3-1stop'>{isLoading ? <Skeleton width={60} /> : powerFailure}</div>
          <div className='small-1stop'>Power Failure</div>
        </div>
        <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
          <div className='h3-1stop'>{isLoading ? <Skeleton width={60} /> : serviceWireIssue}</div>
          <div className='small-1stop'>Service Wire Issues</div>
        </div>
        <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
          <div className='h3-1stop'>{isLoading ? <Skeleton width={60} /> : lineFault}</div>
          <div className='small-1stop'>Line Fault</div>
        </div>
      </div>
      <div className='flex w-full max-w-md cursor-pointer justify-end p-4'>
        <MoreButton />
      </div>
    </div>
  )
}

export default IssueCard
