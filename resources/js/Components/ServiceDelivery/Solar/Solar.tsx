import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../../MoreButton'
import SolarProsumers from './SolarProsumers'
import SolarCapacityTrend from './SolarCapacityTrend'

const Solar = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState(1)

  return (
    <Card className='flex w-full flex-col'>
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
                d='M22.75 3.5H5.25C4.2835 3.5 3.5 4.2835 3.5 5.25V22.75C3.5 23.7165 4.2835 24.5 5.25 24.5H22.75C23.7165 24.5 24.5 23.7165 24.5 22.75V5.25C24.5 4.2835 23.7165 3.5 22.75 3.5Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinejoin='round'
              />
              <path
                d='M7.83984 17.4035L11.1397 14.1037L13.6994 16.6573L19.8333 10.5'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M15.166 10.5H19.8327V15.1667'
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
              setSelectedLevel(3)
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
            className={`border p-5 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </div>
          <div
            className={`border p-5 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </div>
        </div>
        {selectedLevel === 1 && (
          <SolarProsumers
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {selectedLevel === 2 && (
          <SolarCapacityTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Solar Prosumers</p>
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

export default Solar
