import React, { useState } from 'react'
import MoreButton from '../../MoreButton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import MonthPicker from '@/ui/form/MonthPicker'
import Card from '@/ui/Card/Card'
import IssueCard from './IssueCard'
import ComplaintList from './ComplaintList'

const Complaints = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [selectedLevel, setSelectedLevel] = useState(1)

  return (
    <Card className='flex h-full w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
          <div
            className={`rounded-tl-2xl border p-5 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M2.33398 12.8332L11.3757 9.9165'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.334 9.3335L25.6673 7.5835'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M17.5 11.375L25.6667 12.25'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M19.0742 14L25.6659 16.9167'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13.416 5.25H25.0827'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M2.91602 9.33317L7.58268 4.6665'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M7.58398 4.6665V24.4998'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 11.0835H22.7493'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 16.9165H20.416'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 22.75H18.0827'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              // setSelectedLevel(3)
            }}
          ></div>
          <div
            className={`border p-5 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
              // setSelectedLevel('DV')
            }}
          >
            {/* <p>DV</p> */}
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
              // setSelectedLevel('SD')
            }}
          >
            {/* <p>SD</p> */}
          </div>
        </div>
        {selectedLevel === 1 && (
          <IssueCard
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {selectedLevel === 2 && (
          <ComplaintList
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
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

export default Complaints
