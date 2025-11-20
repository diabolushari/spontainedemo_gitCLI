import Widget from '@/Components/PageEditor/Widget'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { useDroppable } from '@dnd-kit/core'
import { XIcon } from 'lucide-react'
import DraggableWidgetWrapper from './DraggableWidgetWrapper'

interface DroppableColumnProps {
  rowId: number
  position: number
  widgetId: number | null
  widget?: WidgetType
  onRemove: () => void
  selectedMonth: Date
}

export default function PageDroppableSlot({
  rowId,
  position,
  widgetId,
  widget,
  onRemove,
  selectedMonth,
}: Readonly<DroppableColumnProps>) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${rowId}-${position}`,
    data: { rowId, position },
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded border-2 border-dashed p-4 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      {widgetId && widget ? (
        <div className='relative'>
          <button
            onClick={onRemove}
            className='absolute right-2 top-2 z-30 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600'
            title='Remove widget'
          >
            <XIcon className='h-4 w-4' />
          </button>
          <DraggableWidgetWrapper
            widget={widget}
            source={{ rowId, position }}
          >
            <Widget widget={widget} anchorMonth={selectedMonth} />
          </DraggableWidgetWrapper>
        </div>
      ) : (
        <div className='flex h-full min-h-[150px] items-center justify-center'>
          <p className='text-sm text-gray-400'>Drop widget here</p>
        </div>
      )}
    </div>
  )
}
