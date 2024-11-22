import React, { useState } from 'react'
import MoreButton from '../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

interface ComplaintValues {
  complaint_count: number
  complaint_type: string
  month_year: string
}

const IssueCard = ({ section_code, levelName, levelCode }: Properties) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [selectedLevel, setSelectedLevel] = useState('ST')

  const [graphValues] = useFetchRecord<{ data: ComplaintValues[] }>(
    `subset/72?${levelName}=${levelCode}&month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
  )

  const complaintCount = (complaint: string) => {
    if (complaint != 'Total') {
      return graphValues?.data
        .filter((value) => value.complaint_type == complaint)
        .reduce((sum, value) => sum + value.complaint_count, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.complaint_count, 0)
    }
  }
  console.log(graphValues)
  const isLoading = !graphValues || graphValues.data.length === 0
  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
          <div
            className={`rounded-tl-2xl border p-5 ${selectedLevel === 'ST' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel('ST')
            }}
          >
            <p>ST</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'RG' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel('RG')
            }}
          >
            <p>RG</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'CR' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel('CR')
            }}
          >
            <p>CR</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
              setSelectedLevel('DV')
            }}
          >
            <p>DV</p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
              setSelectedLevel('SD')
            }}
          >
            <p>SD</p>
          </div>
        </div>

        <div className='ml-auto mr-auto flex justify-center'>
          <div className='grid w-full max-w-md grid-cols-2 gap-4 p-6'>
            <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
              <p className='xlmetric-1stop'>
                {isLoading ? <Skeleton width={60} /> : complaintCount('Total')}
              </p>
              <p className='small-1stop-header text-center'>Total Complaints</p>
            </div>
            <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
              <p className='mdmetric-1stop'>
                {isLoading ? <Skeleton width={60} /> : complaintCount('NO POWER SUPPLY')}
              </p>
              <p className='small-1stop-header text-center'>Power Failures</p>
            </div>
            <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
              <p className='mdmetric-1stop'>
                {isLoading ? <Skeleton width={60} /> : complaintCount('VOLTAGE RELATED')}
              </p>
              <p className='small-1stop-header text-center'>Voltage Related</p>
            </div>
            <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
              <p className='mdmetric-1stop'>
                {isLoading ? <Skeleton width={60} /> : complaintCount('SERVICE CONNECTION RELATED')}
              </p>
              <p className='small-1stop-header text-center'>Service Connection Related</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Customer Complaints</p>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
          new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })} */}
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/17'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default IssueCard
