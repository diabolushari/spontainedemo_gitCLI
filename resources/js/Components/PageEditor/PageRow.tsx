import { ArrowDown, ArrowUp, XIcon } from 'lucide-react'
import PageDroppableSlot from '@/Components/PageEditor/PageDroppableSlot'
import { PageSection, Widget } from '@/interfaces/data_interfaces'

interface PageRowProps {
  row: PageSection
  onDeleteRow: (id: number) => void
  onRemoveWidget: (rowId: number, position: number) => void
  getWidgetById: (id: number) => Widget | undefined
  moveRow: (id: number, pos: string) => void
  selectedMonth: Date
  onRowUpdate: (rowId: number, data: { title?: string; description?: string }) => void
}

export default function PageRow({
  row,
  onDeleteRow,
  onRemoveWidget,
  getWidgetById,
  moveRow,
  selectedMonth,
  onRowUpdate,
}: Readonly<PageRowProps>) {
  return (
    <div
      key={row.id}
      className='group relative'
    >
      {/* Bottom overlap move controls */}
      <div className='pointer-events-auto absolute bottom-[-18px] left-1/2 z-10 flex -translate-x-1/2 gap-2'>
        <button
          type='button'
          onClick={() => moveRow(row.id, 'up')}
          className='flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 shadow hover:bg-gray-300'
          title='Move row up'
        >
          <ArrowUp className='mr-1 h-3 w-3' />
          Up
        </button>
        <button
          type='button'
          onClick={() => moveRow(row.id, 'down')}
          className='flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 shadow hover:bg-gray-300'
          title='Move row down'
        >
          <ArrowDown className='mr-1 h-3 w-3' />
          Down
        </button>
      </div>

      {/* Delete row button */}
      <button
        onClick={() => onDeleteRow(row.id)}
        className='absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100'
        title='Delete row'
      >
        <XIcon className='h-4 w-4' />
      </button>

      <div className='mb-3 space-y-2'>
        <input
          type='text'
          placeholder='Section Title (Optional)'
          value={row.title || ''}
          onChange={(e) => onRowUpdate(row.id, { title: e.target.value })}
          className='w-full border-0 border-b border-transparent bg-transparent px-0 py-1 text-lg font-semibold placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0'
        />
        <textarea
          placeholder='Add a description...'
          value={row.description || ''}
          onChange={(e) => onRowUpdate(row.id, { description: e.target.value })}
          rows={1}
          className='w-full resize-none border-0 border-b border-transparent bg-transparent px-0 py-1 text-sm text-gray-600 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0'
          style={{ minHeight: '2rem' }}
        />
      </div>

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
            selectedMonth={selectedMonth}
          />
        ))}
      </div>
    </div>
  )
}
