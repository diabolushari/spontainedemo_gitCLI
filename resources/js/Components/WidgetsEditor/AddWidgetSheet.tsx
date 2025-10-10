import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import Button from '@/ui/button/Button'
import { useState } from 'react'
import { Link } from '@inertiajs/react'

export function AddWidgetSheet({ collectionId }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          type='button'
          label='Add Widget'
          onClick={() => setOpen(true)}
        />
      </SheetTrigger>

      <SheetContent className='sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>Widgets</SheetTitle>
        </SheetHeader>

        <div>
          <Link href={`/widget-editor/create?collection_id=${collectionId}?type=standard`}>
            <div className='h-50 w-36 rounded-md border border-gray-200 bg-white p-3'>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
