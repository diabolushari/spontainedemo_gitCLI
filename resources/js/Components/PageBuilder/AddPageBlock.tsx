import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet'
import Button from '@/ui/button/Button'
import { EmptyCardBlock } from './EmptyCardBlock'
import useInertiaPost from '@/hooks/useInertiaPost'
import { blockForm } from '@/Pages/PageBuilder/PageShow'
import { Page } from '@/interfaces/data_interfaces'
import { useCallback, useState } from 'react'

type Props = {
  page: Page
}
const pageBuilderCharts = [{ id: 1, name: 'Sample Card', component: <EmptyCardBlock /> }]

export function AddPageBlock({ page }: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

  const { post } = useInertiaPost<blockForm>(route('blocks.store'), {
    showErrorToast: true,
    onComplete: closeModal,
  })

  const handleClick = (name: string) => {
    post({
      name,
      dimensions: {
        padding_top: 'pt-0',
        padding_bottom: 'pb-0',
        margin_top: 'mt-0',
        margin_bottom: 'mb-0',
        mobile_width: 'col-span-full',
        tablet_width: 'md:col-span-full',
        laptop_width: 'lg:col-span-2',
        desktop_width: 'xl:col-span-2',
      },
      page_id: page.id,
      position: 0,
    } as any)
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(pageBuilderCharts[0].name)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          type='button'
          label='Add Block'
          onClick={() => setOpen(true)}
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Block</SheetTitle>
          <SheetDescription>Select a block to add to this page.</SheetDescription>
        </SheetHeader>
        <div className='py-4'>
          <div className='grid grid-cols-1 gap-4'>
            {pageBuilderCharts.map((chart) => (
              <div
                key={chart.id}
                role='button'
                tabIndex={0}
                onClick={() => handleClick(chart.name)}
                onKeyDown={handleKeyDown}
                className='group transform cursor-pointer rounded-md border border-solid p-2 text-sm shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {chart.name}
                <div className='mt-2'>{chart.component}</div>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter className='mt-4'></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
