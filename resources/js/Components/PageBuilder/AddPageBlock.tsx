import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Page } from '@/interfaces/data_interfaces'
import { blockForm } from '@/Pages/PageBuilder/PageShow'
import Button from '@/ui/button/Button'
import Spinner from '@/ui/Spinner'
import { useCallback, useState } from 'react'
import DataExplorerCard from './DataExplorerCard'
import { EmptyCardBlock } from './EmptyCardBlock'

type Props = {
  page: Page
}

const SAMPLE_CARD = 'Sample Card'
const DATA_EXPLORER = 'Data Explorer'

const pageBuilderCharts = [
  { id: 1, name: SAMPLE_CARD, description: 'A simple card block for content' },
  { id: 2, name: DATA_EXPLORER, description: 'Interactive data visualization component' },
]

export function AddPageBlock({ page }: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const closeModal = useCallback(() => {
    setOpen(false)
  }, [])

  const { post, loading } = useInertiaPost<blockForm>(route('blocks.store'), {
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
        laptop_width: name === DATA_EXPLORER ? 'lg:col-span-4' : 'lg:col-span-2',
        desktop_width: name === DATA_EXPLORER ? 'xl:col-span-4' : 'xl:col-span-2',
      },
      page_id: page.id,
      position: 0,
    })
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
        {loading ? (
          <Spinner
            svgStyle='spinner'
            svgSize='w-16 h-16'
          />
        ) : (
          <Button
            type='button'
            label='Add Block'
            onClick={() => setOpen(true)}
            disabled={loading}
          />
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Block</SheetTitle>
          <SheetDescription>Select a block to add to this page.</SheetDescription>
        </SheetHeader>
        {loading ? (
          <Spinner
            svgStyle='spinner'
            svgSize='w-16 h-16'
          />
        ) : (
          <div className='flex justify-center py-4'>
            <div className='grid grid-cols-1 gap-4'>
              {pageBuilderCharts.map((chart) => (
                <div
                  key={chart.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => handleClick(chart.name)}
                  onKeyDown={handleKeyDown}
                  className='group flex h-64 w-64 transform cursor-pointer flex-col justify-between rounded-md border border-solid p-4 text-sm shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  <div className='text-center font-medium'>{chart.name}</div>
                  <div className='mt-2 overflow-hidden'>
                    {chart.name === DATA_EXPLORER && <DataExplorerCard dataExplorerData={null} />}
                    {chart.name === SAMPLE_CARD && <EmptyCardBlock />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <SheetFooter className='mt-4'></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
