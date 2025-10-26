import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import DroppableColumn from './DroppableColumn'

export interface WidgetSlot {
  widgetId: number | null
  position: number
}

export interface PageRowType {
  id: number
  type: 'singleCol' | 'doubleCol' | 'tripleCol'
  title: string
  description: string
  widgets: WidgetSlot[]
}

export interface PageStructure {
  title: string
  description: string
  link: string
  page: PageRowType[]
  published: boolean
}

interface PreviewAreaProps {
  pageStructure: PageStructure
  getWidgetById: (id: number) => WidgetType | undefined
  onRemoveWidget: (rowId: number, position: number) => void
  onDeleteRow: (id: number) => void
}

export default function PreviewArea({
  pageStructure,
  getWidgetById,
  onRemoveWidget,
  onDeleteRow,
}: PreviewAreaProps) {
  if (pageStructure.page.length === 0) {
    return (
      <div className='mt-20 text-center text-gray-400'>
        <svg
          className='mx-auto mb-4 h-12 w-12'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <p className='text-lg font-medium'>Start building your page</p>
        <p className='mt-2 text-sm'>Add layouts and drag widgets into them</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {pageStructure.page.map((row) => (
        <div
          key={row.id}
          className='group relative'
        >
          <button
            onClick={() => onDeleteRow(row.id)}
            className='absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100'
            title='Delete row'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <div
            className={`grid gap-4 rounded border border-gray-200 p-4 ${
              row.type === 'singleCol'
                ? 'grid-cols-1'
                : row.type === 'doubleCol'
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
          >
            {row.widgets.map((slot) => (
              <DroppableColumn
                key={`${row.id}-${slot.position}`}
                rowId={row.id}
                position={slot.position}
                widgetId={slot.widgetId}
                widget={slot.widgetId ? getWidgetById(slot.widgetId) : undefined}
                onRemove={() => onRemoveWidget(row.id, slot.position)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
