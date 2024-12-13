import Card from '@/ui/Card/Card'
import React, { useState } from 'react'
import DataShowIcon from '../ui/DatashowIcon'
import Top10Icon from '../ui/Top10Icon'
import AllArears from './AllArears'
import ArrearsCategory from './ArrearsCategory'
import AllArrearsList from './AllArrearsList'
import TrendIcon from '../ui/TrendIcon'
import AllArrearsTrend from './AllArrearsTrend'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'

const ArrearsCountAndGraph = () => {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  return (
    <Card className='flex h-full w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
          <button
            className={`flex w-full rounded-tl-2xl border border-white px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <DataShowIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <TrendIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <Top10Icon />
          </button>
          <div className='h-full border-r border-white bg-1stop-alt-gray'></div>
        </div>

        {selectedLevel === 1 && (
          <div className='flex w-full flex-col md:flex-row'>
            <div className='flex'>
              <AllArears
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                // setCategories={setCategories}
              />
            </div>
            <div className='flex w-full md:w-2/3'>
              <ArrearsCategory
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
          </div>
        )}

        {selectedLevel === 2 && (
          <AllArrearsTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}

        {selectedLevel === 3 && (
          <AllArrearsList
            column1='Section'
            column2='Arrears'
            subset_id='170'
            default_level='section'
            sortBy='total_arrears'
            route={`office-rankings/Total Arrears?route=${route('finance.index')}`}
          />
        )}
      </div>

      <div className='flex h-full rounded-b-2xl bg-1stop-alt-gray pl-12 selection:justify-between md:px-4'>
        <div className='py-4'>
          <p className='md:mdmetric-1stop smmetric-1stop'>Arrears by Category</p>
        </div>
        <div
          className='small-1stop-header ml-auto flex w-1/4 flex-col items-center justify-center bg-1stop-accent2 bg-opacity-50 md:px-4'
          //   style={{ backgroundBlendMode: 'overlay', opacity: 0.7 }}
        >
          <div style={{ opacity: 1 }}>
            <MonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
        <div className='ml-auto flex items-center px-2 hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Arrears Comparison?month=${dateToYearMonth(selectedMonth)}&route=${route('finance.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default ArrearsCountAndGraph
