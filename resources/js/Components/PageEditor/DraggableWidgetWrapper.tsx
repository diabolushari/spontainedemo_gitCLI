import { useDraggable } from '@dnd-kit/core'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { DragSource } from './DraggableWidget'

interface DraggableWidgetWrapperProps {
  widget: WidgetType
  source: DragSource
  children: React.ReactNode
}

export default function DraggableWidgetWrapper({
  widget,
  source,
  children,
}: DraggableWidgetWrapperProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${widget.id}-${source.rowId}-${source.position}`,
    data: { widgetId: widget.id, widget, source },
  })

  return (
    <div
      ref={setNodeRef}
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className='absolute right-2 top-2 z-20 cursor-move rounded bg-white p-1.5 shadow-md hover:bg-gray-100'
        title='Drag to move'
      >
        <svg
          className='h-4 w-4 text-gray-600'
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
      {children}
    </div>
  )
}
