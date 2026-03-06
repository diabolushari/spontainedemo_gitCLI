import CustomPageRow from '@/Components/PageEditor/CustomPage/CustomPageRow'
import { DashboardPage } from '@/interfaces/data_interfaces'
import { PageProps } from '@/types'
import { router, usePage } from '@inertiajs/react'
import { ArrowRight, Maximize2, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useFetchRecord from '@/hooks/useFetchRecord'
import HighlightBar from '@/Components/WidgetsEditor/WidgetComponents/HighlightBar'

declare function route(name: string, params?: any, absolute?: boolean): string

interface Props {
  pages: DashboardPage[]
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export function getAnchorWidgetFromPage(page: DashboardPage) {
  const anchorId = page.anchor_widget

  const container = page.page?.find((w) => w.widgets.find((w) => w.widgetId === anchorId))

  return container?.widgets.find((w) => w.widgetId === anchorId)
}

export default function DashboardPreviewSection({ pages }: Props) {
  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

  if (!pages || pages.length === 0) return null

  // Only show up to 3 recent pages
  const recentPages = pages.slice(0, 3)
  const selectedPage = recentPages[selectedIndex]

  const handlePillClick = (index: number) => {
    setSelectedIndex(index)
    setIsExpanded(false)
  }

  const anchor_widget = selectedPage ? getAnchorWidgetFromPage(selectedPage)?.widget : null

  const url = anchor_widget?.data.overview.subset_id
    ? `${widget_data_url}${route(
        'subset-field-max-value',
        {
          subsetDetail: anchor_widget?.data.overview.subset_id,
          field: 'month',
        },
        false
      )}`
    : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = Number.parseInt(maxValue.substring(0, 4), 10)
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
        setSelectedMonth(new Date(year, month, 1))
      } else {
        setSelectedMonth(new Date())
      }
    } else if (!loading && !maxValueData) {
      setSelectedMonth(new Date())
    }
  }, [loading, maxValueData, selectedIndex])

  return (
    <div className='mb-12 mt-8 px-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex flex-col items-center justify-center gap-4'>
          <h2 className='text-2xl font-medium text-emerald-800'>Your dashboards</h2>

          {/* Pills for dashboard selection */}
          <div className='flex items-center gap-3'>
            {recentPages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => handlePillClick(index)}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedIndex === index
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {page.title}
              </button>
            ))}
            <button
              onClick={() => router.visit(route('page-editor.index'))}
              className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:text-emerald-600'
              title='Create new dashboard'
            >
              <Plus className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Dashboard Preview Container */}
        <div className='group relative overflow-hidden rounded-3xl bg-white transition-all'>
          {/* Content Container */}
          <motion.div
            animate={{ height: isExpanded ? 'auto' : 500 }}
            className='relative overflow-hidden bg-white'
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className='origin-top p-8 transition-all duration-500 ease-in-out'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedPage ? selectedPage.id : 'empty'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedPage &&
                    selectedPage.config?.highlight_cards &&
                    selectedPage.config.highlight_cards.length > 0 && (
                      <div className='mb-8'>
                        <HighlightBar
                          highlightCards={selectedPage.config.highlight_cards}
                          selectedMonth={selectedMonth}
                        />
                      </div>
                    )}

                  {selectedPage && selectedPage.page && selectedPage.page.length > 0 ? (
                    selectedPage.page.map((row: any) => (
                      <div
                        key={row.id}
                        className='mb-8'
                      >
                        <CustomPageRow
                          row={row}
                          selectedMonth={selectedMonth}
                        />
                      </div>
                    ))
                  ) : (
                    <div className='flex h-64 items-center justify-center'>
                      <p className='text-gray-400'>No content available for preview</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Gradient Overlay - Only show when NOT expanded */}
            {!isExpanded && (
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent' />
            )}
          </motion.div>

          {/* Expand Button - Bottom Right */}
          <div className='absolute bottom-6 right-6 z-10'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-lg active:scale-95'
            >
              <Maximize2 className='h-4 w-4 text-emerald-600' />
              <span>{isExpanded ? 'Collapse View' : 'Expand View'}</span>
            </button>
          </div>
        </div>

        <div className='mt-8 flex justify-center'>
          <button
            onClick={() => router.visit(route('page-editor.index'))}
            className='flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700'
          >
            View more dashboards
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
