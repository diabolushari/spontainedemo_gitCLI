import Card from '@/ui/Card/Card'
import NormalText from '@/typography/NormalText'
import PageBuilderMonthPicker from '@/Components/PageBuilder/PageBuilderMonthPicker'
import React from 'react'
import Heading from '@/typography/Heading'

interface WidgetLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  selectedView?: string
  onViewChange?: (view: string) => void
  hasOverview?: boolean
  hasRanking?: boolean
  hasTrend?: boolean
  hasHighlightCards?: boolean
}

const BASE_BUTTON_CLASSES = 'group rounded-md p-1.5 transition-colors'
const ACTIVE_BUTTON_CLASSES = 'bg-blue-100 hover:bg-blue-200'
const INACTIVE_BUTTON_CLASSES = 'hover:bg-slate-200'
const BASE_ICON_CLASSES = 'h-4 w-4 transition-colors'
const ACTIVE_ICON_CLASSES = 'text-blue-600 group-hover:text-blue-700'
const INACTIVE_ICON_CLASSES = 'text-gray-500 group-hover:text-gray-700'

export default function WidgetLayout({
  children,
  title,
  subtitle,
  selectedMonth,
  setSelectedMonth,
  selectedView = 'overview',
  onViewChange,
  hasOverview = false,
  hasRanking = false,
  hasTrend = false,
  hasHighlightCards = false,
}: Readonly<WidgetLayoutProps>) {
  const handleViewChange = (view: string) => {
    if (onViewChange) {
      onViewChange(view)
    }
  }

  return (
    <Card className='h-full w-full'>
      <div className='flex h-full w-full'>
        {/* Sidebar - Always Vertical */}
        <div className='flex shrink-0 flex-col items-center gap-3 border-r border-gray-200 bg-slate-50 px-2 py-3'>
          {(hasOverview || hasHighlightCards) && (
            <button
              onClick={() => handleViewChange('overview')}
              className={`${BASE_BUTTON_CLASSES} ${
                selectedView === 'overview' ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
              }`}
              aria-label='Overview'
              aria-pressed={selectedView === 'overview'}
              title='Overview'
            >
              <svg
                className={`${BASE_ICON_CLASSES} ${
                  selectedView === 'overview' ? ACTIVE_ICON_CLASSES : INACTIVE_ICON_CLASSES
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                />
              </svg>
            </button>
          )}
          {/* Trend Icon */}
          {hasTrend && (
            <button
              onClick={() => handleViewChange('trend')}
              className={`${BASE_BUTTON_CLASSES} ${
                selectedView === 'trend' ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
              }`}
              aria-label='Trend'
              aria-pressed={selectedView === 'trend'}
              title='Trend'
            >
              <svg
                className={`${BASE_ICON_CLASSES} ${
                  selectedView === 'trend' ? ACTIVE_ICON_CLASSES : INACTIVE_ICON_CLASSES
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                />
              </svg>
            </button>
          )}
          {/* Ranking Icon */}
          {hasRanking && (
            <button
              onClick={() => handleViewChange('ranking')}
              className={`${BASE_BUTTON_CLASSES} ${
                selectedView === 'ranking' ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
              }`}
              aria-label='Ranking'
              aria-pressed={selectedView === 'ranking'}
              title='Ranking'
            >
              <svg
                className={`${BASE_ICON_CLASSES} ${
                  selectedView === 'ranking' ? ACTIVE_ICON_CLASSES : INACTIVE_ICON_CLASSES
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
          <div className='flex shrink-0 items-center justify-between px-4 py-3'>
            <div className='flex flex-col gap-2'>
              {title && <Heading className={`subheader-1stop uppercase`}>{title}</Heading>}
              {!title && (
                <Heading className={`subheader-1stop uppercase text-gray-400`}>title</Heading>
              )}
              {subtitle && <NormalText className='text-gray-500'>{subtitle}</NormalText>}
              {!subtitle && <NormalText className='text-gray-400'>subtitle</NormalText>}
            </div>
            <PageBuilderMonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className='flex-1 overflow-auto px-4 pb-4'>{children}</div>
        </div>
      </div>
    </Card>
  )
}
