import { Carousel, CarouselContent, CarouselItem } from '@/Components/ui/carousel'
import Widget from '@/Components/PageEditor/Widget'
import React from 'react'
import { COLUMN_CONFIG, PageRow } from '@/Pages/PageEditor/CustomPage'

const EmptyWidgetSlot = ({ position }: { position: number }) => (
  <div className='flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
    <p className='text-sm text-gray-400'>Empty slot {position + 1}</p>
  </div>
)

export default function CustomPageRow({ row }: Readonly<{ row: PageRow }>) {
  const config = COLUMN_CONFIG[row.type] || COLUMN_CONFIG.tripleCol
  const sortedWidgets = [...row.widgets].sort((a, b) => a.position - b.position)
  const isMultiColumn = config.cols > 1

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
                <div className='min-h-[200px]'>
                  {widgetData.widget ? (
                    <Widget widget={widgetData.widget} />
                  ) : (
                    <EmptyWidgetSlot position={widgetData.position} />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        /* Grid Layout for single column */
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
      )}
    </section>
  )
}
