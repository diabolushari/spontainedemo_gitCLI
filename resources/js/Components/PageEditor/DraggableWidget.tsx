import { Widget } from '@/interfaces/data_interfaces'
import { useDraggable } from '@dnd-kit/core'

export interface DragSource {
  rowId: number
  position: number
}

interface DraggableWidgetProps {
  widget: Widget
  source?: DragSource
}

export default function DraggableWidget({ widget, source }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: source ? `widget-${widget.id}-${source.rowId}-${source.position}` : `widget-${widget.id}`,
    data: { widgetId: widget.id, widget, source },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`relative cursor-move rounded-md border border-gray-200 bg-white p-3 hover:border-blue-400 hover:shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className='absolute right-2 top-2 rounded-full bg-gray-100 p-1.5 text-gray-500 shadow-sm transition-colors hover:bg-gray-200 hover:text-gray-700'>
        <svg
          className='h-3 w-3'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </div>
      <div className='mb-1 flex items-center gap-2 pr-8'>
        <svg
          className='h-4 w-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
        <span className='text-sm font-medium'>{widget.title}</span>
      </div>
      <p className='text-xs text-gray-500'>{widget.subtitle}</p>
      <div className='mt-2 flex gap-1'>
        <span className='rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700'>{widget.type}</span>
      </div>
    </div>
  )
}
