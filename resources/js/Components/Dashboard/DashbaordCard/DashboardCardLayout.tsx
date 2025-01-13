import React from 'react'
import Card from '@/ui/Card/Card'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import TrendIcon from '@/Components/ui/TrendIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '@/Components/MoreButton'
import DatePicker from '@/ui/form/DatePicker'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'

interface Props {
  title?: string
  children: React.ReactNode
  selectedLevel?: string
  setSelectedLevel?: React.Dispatch<React.SetStateAction<string>>
  selectedDate?: string | null
  setSelectedDate?: React.Dispatch<React.SetStateAction<string | null>>
  selectedMonth?: Date | null
  setSelectedMonth?: React.Dispatch<React.SetStateAction<Date | null>>
  moreUrl: string
  showSidebar?: boolean
  showOverview?: boolean
  showTrend?: boolean
  showRanking?: boolean
  showPercentage?: boolean
  setShowPercentage?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DashboardCardLayout({
  title,
  children,
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  selectedLevel,
  setSelectedLevel,
  moreUrl,
  showPercentage,
  setShowPercentage,
  showSidebar = true,
  showOverview = true,
  showTrend = true,
  showRanking = true,
}: Readonly<Props>) {
  return (
    <Card className='flex flex-col'>
      {/*Sidebar and Content*/}
      <div className='flex w-full flex-grow'>
        {showSidebar && selectedLevel != null && setSelectedLevel != null && (
          <div className='small-1stop-header flex w-14 flex-shrink-0 flex-col rounded-2xl bg-1stop-alt-gray'>
            {showOverview && (
              <button
                className={`flex w-full rounded-tl-2xl border border-white px-2 py-4 ${
                  selectedLevel === 'overview' ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'
                }`}
                onClick={() => setSelectedLevel('overview')}
              >
                <DataShowIcon />
              </button>
            )}
            {showTrend && (
              <button
                className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 'trend' ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
                onClick={() => setSelectedLevel('trend')}
              >
                <TrendIcon />
              </button>
            )}
            {showRanking && (
              <button
                className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 'ranking' ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
                onClick={() => setSelectedLevel('ranking')}
              >
                <Top10Icon />
              </button>
            )}
            <div className='h-full border-r border-white bg-1stop-alt-gray md:min-h-40'></div>
          </div>
        )}
        <div className='flex-shrink-1 flex flex-grow flex-col'>
          <div className='flex w-full justify-end p-2'>
            {showPercentage != null && setShowPercentage != null && selectedLevel !== 'trend' && (
              <button
                className='small-1stop mb-auto cursor-pointer justify-end'
                onClick={() => setShowPercentage((old) => !old)}
              >
                {showPercentage ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
      {/*Footer:if no title then Justify end else  justify between  */}
      <div
        className={`mt-auto flex min-h-[4.2rem] flex-shrink-0 items-center gap-4 justify-self-end ${title == null ? 'justify-end' : 'justify-between'} rounded-b-2xl bg-1stop-alt-gray px-4 pl-12`}
      >
        <div className='py-4'>
          <p className='smmetric-1stop'>{title ?? ' '}</p>
        </div>
        {selectedDate != null && setSelectedDate != null && (
          <div className='small-1stop-header flex h-full items-center bg-1stop-accent2 py-2'>
            <DatePicker
              value={selectedDate ?? ''}
              setValue={setSelectedDate}
              disabled={false}
            />
          </div>
        )}
        {selectedMonth != null && setSelectedMonth != null && (
          <div className='small-1stop-header w-1/ flex h-full bg-1stop-accent2 bg-opacity-50'>
            <div
              style={{ opacity: 1 }}
              className='flex h-full flex-col items-center justify-center gap-2'
            >
              <MonthPicker
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
          </div>
        )}
        <div className='flex items-center pl-2 hover:cursor-pointer hover:opacity-50'>
          <Link href={moreUrl}>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
