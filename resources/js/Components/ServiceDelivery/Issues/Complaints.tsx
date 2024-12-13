import React, { useState } from 'react'
import MoreButton from '../../MoreButton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import IssueCard from './IssueCard'
import ComplaintList from './ComplaintList'
import TopList from '../NewConnectionsList'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import PowerInterruptionTrend2 from '../PowerInterruptionTrend2'
import { div } from 'framer-motion/client'

const Complaints = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [categories, setCategories] = useState<
    {
      complaint_type: string
    }[]
  >([])

  return (
    <Card className='flex h-full w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-t-2xl bg-1stop-alt-gray'>
          <button
            className={`flex w-full rounded-tl-2xl border border-white px-2 py-4 hover:cursor-pointer ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <DataShowIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 hover:cursor-pointer ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <Top10Icon />
          </button>
          <div className='h-full border-r border-white bg-1stop-alt-gray'></div>
        </div>

        {selectedLevel === 1 && (
          <div className='flex w-full flex-col md:flex-row'>
            <div className='flex md:w-1/3'>
              <IssueCard
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                setCategories={setCategories}
              />
            </div>
            <div className='flex w-2/3'>
              <PowerInterruptionTrend2
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
          </div>
        )}

        {selectedLevel === 2 && (
          <ComplaintList
            column1='Division'
            column2='Complaint count'
            subset_id='72'
            displayKey='complaint_count'
            setCategories={setCategories}
            categories={categories}
          />
        )}
      </div>

      <div className='flex items-center justify-between gap-1 rounded-b-2xl bg-1stop-alt-gray px-2 pl-14'>
        <div className='py-3'>
          <p className='mdmetric-1stop'>Customer Complaints</p>
        </div>
        <div className='small-1stop-header flex h-full items-center justify-center bg-1stop-accent2'>
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Customer Complaints Summary?latest=month&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default Complaints
