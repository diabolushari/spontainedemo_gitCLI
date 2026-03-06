import React from 'react'
import type { Page, Widget as WidgetType } from '@/interfaces/data_interfaces'
import { DashboardPage as PageData } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import CustomPageRow from '@/Components/PageEditor/CustomPage/CustomPageRow'
import { useState, useEffect } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import HeadingStyleComponent from '@/Components/PageEditor/HeadingStyleComponent'
import HighlightBar from '@/Components/WidgetsEditor/WidgetComponents/HighlightBar'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'

interface PageWidget {
  position: number
  widgetId: number | null
  widget: WidgetType | null
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export interface PageRow {
  id: number
  type: 'tripleCol' | 'doubleCol' | 'singleCol' | 'quadCol'
  title: string | null
  description: string | null
  widgets: PageWidget[]
}

interface CustomPageProps {
  page: PageData
}

export const COLUMN_CONFIG: Record<
  string,
  { cols: number; className: string; carouselBasis: string }
> = {
  singleCol: { cols: 1, className: 'grid-cols-1', carouselBasis: 'basis-full' },
  doubleCol: {
    cols: 2,
    className: 'grid-cols-1 md:grid-cols-2',
    carouselBasis: 'basis-full md:basis-1/2',
  },
  tripleCol: {
    cols: 3,
    className: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    carouselBasis: 'basis-full md:basis-1/2 lg:basis-1/3',
  },
}

export function getAnchorWidgetFromPage(page: PageData) {
  const anchorId = page.anchor_widget

  const container = page.page.find((w) => w.widgets.find((w) => w.widgetId === anchorId))

  return container?.widgets.find((w) => w.widgetId === anchorId)
}

export default function CustomPage({ page }: Readonly<CustomPageProps>) {
  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props
  console.log(page)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

  const anchor_widget = getAnchorWidgetFromPage(page)?.widget

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
  }, [loading, maxValueData])

  return (
    <AnalyticsDashboardLayout>
      <div className='min-h-screen w-full bg-white py-8 sm:px-6'>
        {/* Page Header */}
        <header className='mb-8 border-b pb-6'>
          {page.config?.heading_style !== undefined && page.config?.heading_style !== null ? (
            <HeadingStyleComponent
              title={page.title}
              description={page.description}
              currentStyle={page.config.heading_style}
              readOnly={true}
              noBackground={true}
            />
          ) : (
            <>
              <h1 className='text-3xl font-bold text-gray-900'>{page.title}</h1>
              {page.description && (
                <p className='mt-2 text-base text-gray-600'>{page.description}</p>
              )}
            </>
          )}
          {!page.published && (
            <div className='mt-3 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800'>
              Draft
            </div>
          )}
        </header>

        {page.config?.highlight_cards && page.config.highlight_cards.length > 0 && (
          <div className='mb-8'>
            <HighlightBar
              highlightCards={page.config.highlight_cards}
              selectedMonth={selectedMonth}
            />
          </div>
        )}

        {/* Page Content */}
        <main>
          {page.page && page.page.length > 0 ? (
            page.page.map((row) => (
              <CustomPageRow
                key={row.id}
                row={row}
                selectedMonth={selectedMonth}
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
