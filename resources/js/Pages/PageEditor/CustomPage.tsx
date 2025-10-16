import React from 'react'
import Widget from '@/Components/PageEditor/Widget'
import type { Widget as WidgetType } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'

// TypeScript Interfaces
interface PageWidget {
  position: number
  widgetId: number | null
  widget: WidgetType | null
}

interface PageRow {
  id: number
  type: 'tripleCol' | 'doubleCol' | 'singleCol' | 'quadCol'
  title: string | null
  description: string | null
  widgets: PageWidget[]
}

interface PageData {
  id: number
  title: string
  description: string
  link: string
  page: PageRow[]
  published: boolean
  created_at: string
  updated_at: string
}

interface CustomPageProps {
  page: PageData
}

// Column configuration mapping
const COLUMN_CONFIG: Record<string, { cols: number; className: string }> = {
  singleCol: { cols: 1, className: 'grid-cols-1' },
  doubleCol: { cols: 2, className: 'grid-cols-1 md:grid-cols-2' },
  tripleCol: { cols: 3, className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
  quadCol: { cols: 4, className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' },
}

// Empty widget placeholder component
const EmptyWidgetSlot = ({ position }: { position: number }) => (
  <div className='flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
    <p className='text-sm text-gray-400'>Empty slot {position + 1}</p>
  </div>
)

// Row component for better organization
const PageRow = ({ row }: { row: PageRow }) => {
  const config = COLUMN_CONFIG[row.type] || COLUMN_CONFIG.tripleCol
  const sortedWidgets = [...row.widgets].sort((a, b) => a.position - b.position)

  return (
    <section className='mb-8'>
      {/* Row Header */}
      {(row.title || row.description) && (
        <div className='mb-4'>
          {row.title && <h2 className='text-2xl font-semibold text-gray-800'>{row.title}</h2>}
          {row.description && <p className='mt-1 text-sm text-gray-600'>{row.description}</p>}
        </div>
      )}

      {/* Grid Layout */}
      <div className={`grid gap-6 ${config.className}`}>
        {sortedWidgets.map((widgetData) => (
          <div
            key={`widget-${row.id}-${widgetData.position}`}
            className='min-h-[200px]'
          >
            {widgetData.widget ? (
              <Widget widget={widgetData.widget} />
            ) : (
              <EmptyWidgetSlot position={widgetData.position} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// Main CustomPage component
export default function CustomPage({ page }: Readonly<CustomPageProps>) {
  if (!page) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg text-gray-500'>No page data available</p>
      </div>
    )
  }

  return (
    <AnalyticsDashboardLayout>
      <div className='min-h-screen w-full bg-white py-8 sm:px-6'>
        {/* Page Header */}
        <header className='mb-8 border-b pb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>{page.title}</h1>
          {page.description && <p className='mt-2 text-base text-gray-600'>{page.description}</p>}
          {!page.published && (
            <div className='mt-3 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800'>
              Draft
            </div>
          )}
        </header>

        {/* Page Content */}
        <main>
          {page.page && page.page.length > 0 ? (
            page.page.map((row) => (
              <PageRow
                key={row.id}
                row={row}
              />
            ))
          ) : (
            <div className='flex h-64 items-center justify-center'>
              <p className='text-gray-500'>No content available</p>
            </div>
          )}
        </main>
      </div>
    </AnalyticsDashboardLayout>
  )
}
