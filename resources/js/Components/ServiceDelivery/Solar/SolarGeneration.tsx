import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../../MoreButton'

import SolarGenerationTrend from './SolarGenerationTrend'
import { dateToYearMonth } from '../ActiveConnection'

const SolarGeneration = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex h-5/6 w-full'>
        <SolarGenerationTrend
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>

      <div className='flex h-1/6 items-center justify-end gap-8 rounded-b-2xl bg-1stop-alt-gray px-4 pl-14'>
        <div className='py-2'>{/* <p className='mdmetric-1stop'>Solar Generation</p> */}</div>
        <div className='small-1stop-header flex h-full w-1/2 flex-col items-center justify-center bg-1stop-accent2 px-4 md:w-1/4'>
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='flex items-center py-3 pl-2 hover:cursor-pointer hover:opacity-50 md:py-0'>
          <Link
            href={`/data-explorer/Solar Generation Trend?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default SolarGeneration
