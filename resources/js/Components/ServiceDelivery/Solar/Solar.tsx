import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../../MoreButton'
import SolarProsumers from './SolarProsumers'
import SolarCapacityTrend from './SolarCapacityTrend'
import TopList from '../NewConnectionsList'
import SolarList from './SolarList'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import TrendIcon from '@/Components/ui/TrendIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import { dateToYearMonth } from '../ActiveConnection'

const Solar = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [categories, setCategories] = useState<
    {
      voltage: string
    }[]
  >([])
  const [selectedLevel, setSelectedLevel] = useState(1)

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-t-2xl bg-1stop-alt-gray'>
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
        {selectedLevel === 3 && (
          <SolarList
            column1='Division'
            column2='Capacity'
            subset_id='71'
            default_level='section'
            sortBy='capacity_kw'
          />
        )}
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-alt-gray px-4 pl-14'>
        <div className=''>
          <p className='md:mdmetric-1stop smmetric-1stop'>Solar Prosumers</p>
        </div>
        <div className='small-1stop-header flex h-full w-1/4 flex-col items-center justify-center bg-1stop-accent2 py-4'>
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
        <div className='flex items-center pl-2 hover:cursor-pointer hover:opacity-50'>
          <Link
            href={`/data-explorer/Solar Prosumer Statistics?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default Solar
