import React, { useEffect, useState } from 'react'
import MoreButton from '../../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ActiveConnection'

interface ComplaintValues {
  complaint_count: number
  complaint_type: string
  month_year: string
}
interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const IssueCard = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [graphValues] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const complaintCount = (complaint: string) => {
    if (complaint != 'Total') {
      return graphValues?.data
        .filter((value) => value.complaint_type == complaint)
        .reduce((sum, value) => sum + value.complaint_count, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.complaint_count, 0)
    }
  }

  const isLoading = !graphValues || graphValues.data.length === 0
  return (
    <div className='flex w-full'>
      <div className='flex justify-center'>
        <div className='grid w-full max-w-md grid-cols-2 gap-2 p-2'>
          <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-5 hover:bg-1stop-highlight2'>
            <p className='xlmetric-1stop'>
              {isLoading ? <Skeleton width={60} /> : formatNumber(complaintCount('Total') ?? 0)}
            </p>
            <p className='small-1stop-header text-center'>Total Complaints</p>
          </div>
          <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
            <p className='mdmetric-1stop'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('NO POWER SUPPLY') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Power Failures</p>
          </div>
          <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
            <p className='mdmetric-1stop'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('VOLTAGE RELATED') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Voltage Related</p>
          </div>
          <div className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-5 hover:bg-1stop-highlight2'>
            <p className='mdmetric-1stop pt-4'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('SERVICE CONNECTION RELATED') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Service Conn. Related</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueCard
