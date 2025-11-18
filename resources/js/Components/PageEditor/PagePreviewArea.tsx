import { DashboardPage as PageStructure, Widget as WidgetType } from '@/interfaces/data_interfaces'
import { FilePlus2 } from 'lucide-react'
import PageRow from '@/Components/PageEditor/PageRow'

interface PreviewAreaProps {
  pageStructure: PageStructure
  getWidgetById: (id: number) => WidgetType | undefined
  onRemoveWidget: (rowId: number, position: number) => void
  onDeleteRow: (id: number) => void
  onLayoutClick: (layout: string) => void
  moveRow: (id: number, pos: 'up' | 'down') => void
}

export default function PagePreviewArea({
  pageStructure,
  getWidgetById,
  onRemoveWidget,
  onDeleteRow,
  onLayoutClick,
  moveRow,
}: Readonly<PreviewAreaProps>) {
  return (
    <>
      {pageStructure.page.length === 0 && (
        <div className='mt-20 text-center text-gray-400'>
          <FilePlus2
            className='mx-auto mb-4 h-12 w-12'
            strokeWidth={2}
          />
          <p className='text-lg font-medium'>Start building your page</p>
          <p className='mt-2 text-sm'>Add layouts and drag widgets into them</p>
        </div>
      )}

      {pageStructure.page.map((row) => (
        <PageRow
          key={row.id}
          row={row}
          onDeleteRow={onDeleteRow}
          onRemoveWidget={onRemoveWidget}
          getWidgetById={getWidgetById}
          moveRow={moveRow}
        />
      ))}

      {/* Dashed Add Layouts area */}
      <div className='mt-8 rounded-xl border border-dashed border-blue-300 bg-slate-50 px-4 py-8'>
        <div className='flex flex-col items-center gap-6'>
          <p className='text-lg font-medium text-gray-500'>+ Add layouts</p>

          <div>
            <h3 className='mb-3 text-xs font-semibold uppercase text-gray-500'>Choose a layout</h3>

            <div className='grid grid-cols-3 gap-3'>
              <div
                className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
                onClick={() => onLayoutClick('singleCol')}
              >
                <div className='mb-2 h-20 rounded bg-gray-100' />
                <span className='text-sm'>Single Column</span>
              </div>

              <div
                className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
                onClick={() => onLayoutClick('doubleCol')}
              >
                <div className='mb-2 grid h-20 grid-cols-2 gap-2'>
                  <div className='rounded bg-gray-100' />
                  <div className='rounded bg-gray-100' />
                </div>
                <span className='text-sm'>Two Columns</span>
              </div>

              <div
                className='cursor-pointer rounded-md border border-gray-200 bg-white p-4 hover:border-blue-400'
                onClick={() => onLayoutClick('tripleCol')}
              >
                <div className='mb-2 grid h-20 grid-cols-3 gap-2'>
                  <div className='rounded bg-gray-100' />
                  <div className='rounded bg-gray-100' />
                  <div className='rounded bg-gray-100' />
                </div>
                <span className='text-sm'>Three Columns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
