import Card from '@/ui/Card/Card'
import NormalText from '@/typography/NormalText'
import CardHeader from '@/ui/Card/CardHeader'
import PageBuilderMonthPicker from '@/Components/PageBuilder/PageBuilderMonthPicker'

interface WidgetLayoutProps {
  children: React.ReactNode
  block: any
  selectedMonth: Date | null
  setSelectedMonth: (date: Date | null) => void
  selectedView?: string
  onViewChange?: (view: string) => void
}

export default function WidgetLayout({
  children,
  block,
  selectedMonth,
  setSelectedMonth,
  selectedView = 'overview',
  onViewChange,
}: Readonly<WidgetLayoutProps>) {
  const handleViewChange = (view: string) => {
    if (onViewChange) {
      onViewChange(view)
    }
  }

  return (
    <Card>
      <div className='grid grid-cols-[auto_1fr]'>
        {/* Sidebar */}
        <div className='flex flex-col items-center gap-3 border-r border-gray-200 bg-slate-50 px-2 py-3'>
          {/* Overview Icon */}
          <button
            onClick={() => handleViewChange('overview')}
            className={`group rounded-md p-1.5 transition-colors ${
              selectedView === 'overview' ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-slate-200'
            }`}
            aria-label='Overview'
            aria-pressed={selectedView === 'overview'}
            title='Overview'
          >
            <svg
              className={`h-4 w-4 transition-colors ${
                selectedView === 'overview'
                  ? 'text-blue-600 group-hover:text-blue-700'
                  : 'text-gray-500 group-hover:text-gray-700'
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

          {/* Trend Icon */}
          <button
            onClick={() => handleViewChange('trend')}
            className={`group rounded-md p-1.5 transition-colors ${
              selectedView === 'trend' ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-slate-200'
            }`}
            aria-label='Trend'
            aria-pressed={selectedView === 'trend'}
            title='Trend'
          >
            <svg
              className={`h-4 w-4 transition-colors ${
                selectedView === 'trend'
                  ? 'text-blue-600 group-hover:text-blue-700'
                  : 'text-gray-500 group-hover:text-gray-700'
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

          {/* Ranking Icon */}
          <button
            onClick={() => handleViewChange('ranking')}
            className={`group rounded-md p-1.5 transition-colors ${
              selectedView === 'ranking' ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-slate-200'
            }`}
            aria-label='Ranking'
            aria-pressed={selectedView === 'ranking'}
            title='Ranking'
          >
            <svg
              className={`h-4 w-4 transition-colors ${
                selectedView === 'ranking'
                  ? 'text-blue-600 group-hover:text-blue-700'
                  : 'text-gray-500 group-hover:text-gray-700'
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
        </div>

        {/* Main Content */}
        <div>
          <div className='flex items-center justify-between px-4 py-3'>
            <CardHeader title={block?.title} />
            <PageBuilderMonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className='px-4'>
            <NormalText className='mb-2 text-gray-500'>{block?.subtitle}</NormalText>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </Card>
  )
}
