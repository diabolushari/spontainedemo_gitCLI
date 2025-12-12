import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import Button from '@/ui/button/Button'
import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { WidgetCollection } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'
import { PlusIcon } from 'lucide-react'

export function AddWidgetSheet({
  collections = [],
  children,
}: {
  collections?: WidgetCollection[]
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | string>('')
  const [showCollectionModal, setShowCollectionModal] = useState(false)

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        {children ?? (
          <Button
            type='button'
            label='Add Widget'
            onClick={() => setOpen(true)}
          />
        )}
      </SheetTrigger>

      <SheetContent className='sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>Widgets</SheetTitle>
        </SheetHeader>

        <div className='space-y-4'>
          {/* Collection Selector */}
          {collections.length > 0 && (
            <div className='mb-4 flex items-end gap-2'>
              <div className='flex-1'>
                <SelectList
                  label='Collection'
                  value={selectedCollectionId}
                  setValue={(value) => setSelectedCollectionId(value)}
                  list={collections}
                  dataKey='id'
                  displayKey='name'
                  style='normal'
                />
              </div>
              <button
                type='button'
                className='mb-[2px] rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300'
                onClick={() => setShowCollectionModal(true)}
                title='Create New Collection'
              >
                <PlusIcon className='h-5 w-5' />
              </button>
            </div>
          )}

          {showCollectionModal && (
            <WidgetCollectionCreateModal setShowModal={setShowCollectionModal} />
          )}

          {selectedCollectionId ? (
            <Link
              href={`/widget-editor/create?collection_id=${selectedCollectionId}&type=overview`}
            >
              <div className='h-50 w-36 rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-md'>
                {/* Mini header */}
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-xs font-semibold text-gray-700'>Chart</span>
                  <span className='text-[10px] text-gray-400'>2024</span>
                </div>

                {/* Simplified bar chart preview */}
                <div className='flex h-20 items-end justify-around gap-1'>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '30%' }}
                  ></div>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '60%' }}
                  ></div>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '20%' }}
                  ></div>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '40%' }}
                  ></div>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '90%' }}
                  ></div>
                  <div
                    className='w-2 rounded-t bg-teal-400'
                    style={{ height: '50%' }}
                  ></div>
                </div>

                {/* Label */}
                <p className='mt-2 text-center text-[10px] text-gray-500'>Bar Chart</p>
              </div>
            </Link>
          ) : (
            <div className='h-50 w-36 cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 p-3 opacity-50'>
              {/* Mini header */}
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-semibold text-gray-700'>Chart</span>
                <span className='text-[10px] text-gray-400'>2024</span>
              </div>

              {/* Simplified bar chart preview */}
              <div className='flex h-20 items-end justify-around gap-1'>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '30%' }}
                ></div>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '60%' }}
                ></div>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '20%' }}
                ></div>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '40%' }}
                ></div>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '90%' }}
                ></div>
                <div
                  className='w-2 rounded-t bg-gray-400'
                  style={{ height: '50%' }}
                ></div>
              </div>

              {/* Label */}
              <p className='mt-2 text-center text-[10px] text-gray-500'>Bar Chart</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
