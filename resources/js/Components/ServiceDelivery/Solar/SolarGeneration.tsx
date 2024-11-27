import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../../MoreButton'
import SolarProsumers from './SolarProsumers'
import SolarCapacityTrend from './SolarCapacityTrend'

const SolarGeneration = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState(1)

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
          <div
            className={`flex w-full rounded-tl-2xl border px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-accent2'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <div className='flex w-full items-center justify-center'>
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
          </div>

          <div
            className={`border px-2 py-7 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </div>
          <div
            className={`border px-2 py-7 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </div>
          <div
            className={`border px-2 py-7 ${selectedLevel === 'DV' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </div>
          <div
            className={`px-2 py-7 ${selectedLevel === 'SD' ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </div>
        </div>
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-button-muted px-4 pl-14'>
        <div className='w-1/3'>
          <p className='h3-1stop'>Solar Generation</p>
        </div>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4 py-4'>
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

export default SolarGeneration
