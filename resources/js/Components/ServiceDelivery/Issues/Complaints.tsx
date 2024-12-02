import React, { useState } from 'react'
import MoreButton from '../../MoreButton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import IssueCard from './IssueCard'
import ComplaintList from './ComplaintList'
import TopList from '../TopList'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import Top10Icon from '@/Components/ui/Top10Icon'

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
        <div className='small-1stop-header flex w-1/6 flex-col rounded-2xl'>
          <button
            className={`flex w-full rounded-tl-2xl border px-2 py-4 hover:cursor-pointer ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <DataShowIcon />
          </button>
          <button
            className={`flex w-full border px-2 py-4 hover:cursor-pointer ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <Top10Icon />
          </button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              // setSelectedLevel(3)
            }}
          ></button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
              // setSelectedLevel('DV')
            }}
          >
            {/* <p>DV</p> */}
          </button>
          <button
            className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
              // setSelectedLevel('SD')
            }}
          >
            {/* <p>SD</p> */}
          </button>
        </div>
        {selectedLevel === 1 && (
          <IssueCard
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setCategories={setCategories}
          />
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

      <div className='flex h-full items-center justify-between gap-1 rounded-b-2xl bg-button-muted pl-14'>
        <div className='w-1/3'>
          <p className='h3-1stop'>Customer Complaints</p>
        </div>
        <div className='small-1stop-header flex h-full w-1/3 items-center justify-center bg-1stop-accent2 py-4'>
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
          <Link
            href={`/data-explorer/Customer Complaints Summary?latest=month_year?route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default Complaints
