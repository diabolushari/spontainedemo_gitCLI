import React, { useCallback, useEffect, useState } from 'react'
import MoreButton from '../../MoreButton'
import useFetchList from '@/hooks/useFetchList'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, router } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ActiveConnection'

interface ComplaintValues {
  complaint_count: number
  complaint_type: string
  month_year: string
}
interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  setCategories: React.Dispatch<
    React.SetStateAction<
      {
        complaint_type: string
      }[]
    >
  >
}

const IssueCard = ({ selectedMonth, setSelectedMonth, setCategories }: Properties) => {
  const [graphValues] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    setCategories(
      Array.from(new Set(graphValues?.data?.map((item) => item.complaint_type) || [])).map(
        (complaint_type) => ({ complaint_type })
      )
    )
  }, [setCategories, graphValues])
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
  const detailRoute = () => {
    router.get(
      `/data-explorer/Customer Complaints Summary?latest=month&route=${route('service-delivery.index')}`
    )
  }

  const handleGraphSelection = useCallback(
    (subset: string, complaint_type: string | null) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Customer Complaints Summary',
          subset: subset,
          complaint_type: complaint_type,
          month: dateToYearMonth(selectedMonth),
          route: route('service-delivery.index'),
        })
      )
    },
    [selectedMonth]
  )

  return (
    <div className='flex w-full flex-col md:flex-row'>
      <div className='flex justify-center'>
        <div className='grid w-full grid-cols-2 gap-2 p-2 md:max-w-md'>
          <button
            onClick={() => handleGraphSelection('Customer Complaints - Aggregate', null)}
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop lg:mdmetric-1stop'>
              {isLoading ? <Skeleton width={60} /> : formatNumber(complaintCount('Total') ?? 0)}
            </p>
            <p className='small-1stop-header text-center'>Total Complaints</p>
          </button>
          <button
            onClick={() =>
              handleGraphSelection('Customer Complaints - All Types', 'NO POWER SUPPLY')
            }
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop lg:mdmetric-1stop'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('NO POWER SUPPLY') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Power Failures</p>
          </button>
          <button
            onClick={() =>
              handleGraphSelection('Customer Complaints - All Types', 'VOLTAGE RELATED')
            }
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop lg:mdmetric-1stop'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('VOLTAGE RELATED') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Voltage Related</p>
          </button>
          <button
            onClick={() =>
              handleGraphSelection('Customer Complaints - All Types', 'SERVICE CONNECTION RELATED')
            }
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop lg:mdmetric-1stop pt-4'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(complaintCount('SERVICE CONNECTION RELATED') ?? 0)
              )}
            </p>
            <p className='small-1stop-header text-center'>Service Conn. Related</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default IssueCard
