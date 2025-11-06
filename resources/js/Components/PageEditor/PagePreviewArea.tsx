import { DashboardPage as PageStructure, Widget as WidgetType } from '@/interfaces/data_interfaces'
import { FilePlus2, XIcon } from 'lucide-react'
import PageDroppableSlot from './PageDroppableSlot'

interface PreviewAreaProps {
  pageStructure: PageStructure
  getWidgetById: (id: number) => WidgetType | undefined
  onRemoveWidget: (rowId: number, position: number) => void
  onDeleteRow: (id: number) => void
}

export default function PagePreviewArea({
  pageStructure,
  getWidgetById,
  onRemoveWidget,
  onDeleteRow,
}: PreviewAreaProps) {
  return (
    <>
      {pageStructure.page.length === 0 && (
        <div className='mt-20 text-center text-gray-400'>
          <FilePlus2
            className={'mx-auto mb-4 h-12 w-12'}
            strokeWidth={2}
          />
          <p className='text-lg font-medium'>Start building your page</p>
          <p className='mt-2 text-sm'>Add layouts and drag widgets into them</p>
        </div>
      )}
      {pageStructure.page.length > 0 && (
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
                <XIcon className='h-4 w-4' />
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
                  <PageDroppableSlot
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
      )}
    </>
  )
}
