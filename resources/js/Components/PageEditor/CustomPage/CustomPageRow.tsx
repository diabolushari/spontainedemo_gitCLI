import { Carousel, CarouselContent, CarouselItem, CarouselDots } from '@/Components/ui/carousel'
import Widget from '@/Components/PageEditor/Widget'
import RichTextEditor from '@/Components/PageEditor/RichTextEditor' // Ensure this path is correct
import React from 'react'
import { COLUMN_CONFIG } from '@/Pages/PageEditor/CustomPage'
import { PageSection as PageRow } from '@/interfaces/data_interfaces'

const EmptyWidgetSlot = ({ position }: { position: number }) => (
  <div className='flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
    <p className='text-sm text-gray-400'>Empty slot {position + 1}</p>
  </div>
)

export default function CustomPageRow({
  row,
  selectedMonth,
}: Readonly<{ row: PageRow; selectedMonth: Date }>) {
  const config = COLUMN_CONFIG[row.type] || COLUMN_CONFIG.tripleCol
  const sortedWidgets = [...row.widgets].sort((a, b) => a.position - b.position)
  const isMultiColumn = config.cols > 1

  const renderSlotContent = (widgetData: any) => {
    // 1. Check for Text Block
    if (widgetData.type === 'text') {
      return (
        <RichTextEditor
          content={widgetData.textContent || ''}
          onChange={() => {}} // No-op for read-only
          editable={false}
        />
      )
    }

    // 2. Check for Widget
    if (widgetData.widget) {
      return (
        <Widget
          widget={widgetData.widget}
          anchorMonth={selectedMonth}
        />
      )
    }

    // 3. Fallback to Empty Slot
    return <EmptyWidgetSlot position={widgetData.position} />
  }

  return (
    <section className='mb-8'>
      {/* Row Header */}
      {(row.title || row.description) && (
        <div className='mb-4'>
          {row.title && <h2 className='text-2xl font-semibold text-gray-800'>{row.title}</h2>}
          {row.description && <p className='mt-1 text-sm text-gray-600'>{row.description}</p>}
        </div>
      )}

      {/* Carousel for multi-column rows */}
      {isMultiColumn ? (
        <div>
          <Carousel
            opts={{ loop: false }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {sortedWidgets.map((widgetData) => (
                <CarouselItem
                  key={`widget-${row.id}-${widgetData.position}`}
                  className={`pl-4 ${config.carouselBasis}`}
                >
                  <div className='h-full min-h-[200px]'>{renderSlotContent(widgetData)}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Show dots only on mobile */}
            <div className='md:hidden'>
              <CarouselDots />
            </div>
          </Carousel>
        </div>
      ) : (
        /* Grid Layout for single column */
        <div className={`grid gap-6 ${config.className}`}>
          {sortedWidgets.map((widgetData) => (
            <div
              key={`widget-${row.id}-${widgetData.position}`}
              className='h-full min-h-[200px]'
            >
              {renderSlotContent(widgetData)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
