import Widget from '@/Components/PageEditor/Widget'
import { Widget as WidgetType, WidgetPosition } from '@/interfaces/data_interfaces'
import { useDroppable } from '@dnd-kit/core'
import { XIcon, Type, LayoutTemplate, Plus } from 'lucide-react'
import DraggableWidgetWrapper from './DraggableWidgetWrapper'
import RichTextEditor from './RichTextEditor' // Adjust path if necessary

interface DroppableColumnProps {
  rowId: number
  position: number
  widgetId: number | null
  widget?: WidgetType
  slot?: WidgetPosition // Added to access 'type' and 'textContent'
  selectedMonth: Date
  onRemove: () => void
  onAddTextBlock: () => void
  onTextUpdate: (content: string) => void
  onAddWidget: () => void
  selectWidget: (row: { rowId: number; position: number }) => void
  handleRemoveTextBlock: (rowId: number, position: number) => void
}

export default function PageDroppableSlot({
  rowId,
  position,
  widgetId,
  widget,
  slot,
  selectedMonth,
  onRemove,
  onAddTextBlock,
  onTextUpdate,
  onAddWidget,
  selectWidget,
  handleRemoveTextBlock,
}: Readonly<DroppableColumnProps>) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${rowId}-${position}`,
    data: { rowId, position },
  })

  // Check if this slot is currently holding a text block
  const isTextMode = slot?.type === 'text'

  return (
    <div
      ref={setNodeRef}
      className={`relative flex min-h-[200px] flex-col rounded border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
      }`}
    >
      {/* CASE 1: TEXT EDITOR */}
      {isTextMode ? (
        <div className='relative h-full w-full p-2'>
          <button
            onClick={() => handleRemoveTextBlock(rowId, position)}
            className='absolute -right-2 -top-2 z-30 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600'
            title='Remove text block'
          >
            <XIcon className='h-4 w-4' />
          </button>
          <RichTextEditor
            content={slot?.textContent ?? ''}
            onChange={onTextUpdate}
            editable={true}
          />
        </div>
      ) : widgetId && widget ? (
        // CASE 2: WIDGET
        <div className='relative w-full p-4'>
          <button
            onClick={onRemove}
            className='absolute right-2 top-2 z-30 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600'
            title='Remove widget'
          >
            <XIcon className='h-4 w-4' />
          </button>

          <Widget
            widget={widget}
            anchorMonth={selectedMonth}
          />
        </div>
      ) : (
        // CASE 3: EMPTY SLOT (Buttons)
        <div className='flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-6'>
          <p className='text-sm font-medium text-gray-400'>
            {isOver ? 'Drop widget now' : 'Empty Slot'}
          </p>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => selectWidget({ rowId: rowId, position: position })}
              className='group flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95'
            >
              <LayoutTemplate className='h-4 w-4 text-gray-500 group-hover:text-blue-500' />
              Add Widget
            </button>

            <span className='text-xs text-gray-300'>OR</span>

            <button
              onClick={onAddTextBlock}
              className='group flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95'
            >
              <Type className='h-4 w-4 text-gray-500 group-hover:text-blue-500' />
              Add Text
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
