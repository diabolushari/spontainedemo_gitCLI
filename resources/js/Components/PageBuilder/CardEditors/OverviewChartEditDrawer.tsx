import { CardContent } from '@/Components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/Components/ui/carousel'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/Components/ui/drawer'
import Card from '@/ui/Card/Card'
import OverviewChartGeneralEdit from './OverviewCard/OverviewChart/OverviewChartGeneralEdit'
import Button from '@/ui/button/Button'
import { X } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface OverviewChartEditDrawerProps {
  open: boolean
  setOpen: (value: boolean) => void
  initialData?: any
  blockId: string | number
}

export default function OverviewChartEditDrawer({
  open,
  setOpen,
  initialData,
  blockId,
}: OverviewChartEditDrawerProps) {
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Create a ref to the form
  const generalEditRef = useRef<OverviewChartGeneralEditHandle>(null)

  const editItems = [
    {
      item: 'General',
      component: (
        <OverviewChartGeneralEdit
          ref={generalEditRef}
          initialData={initialData}
          blockId={blockId}
        />
      ),
    },
  ]

  // Custom Next click handler
  const handleNext = async () => {
    try {
      if (carouselIndex === 0 && generalEditRef.current) {
        await generalEditRef.current.submit()
      }
      setCarouselIndex((prev) => Math.min(prev + 1, editItems.length - 1))
    } catch (err) {
      alert('Form submission failed. Please check and try again.')
    }
  }

  // Custom Previous click handler
  const handlePrevious = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(value) => {
        if (!value) return
        setOpen(true)
      }}
    >
      <DrawerContent
        className='h-full duration-300'
        style={{
          height: '85vh',
          minHeight: '5vh',
        }}
      >
        <div className='absolute right-2 top-2 justify-end'>
          <DrawerClose asChild>
            <Button
              variant='danger'
              label=''
              icon={<X />}
              onClick={() => setOpen(false)}
            />
          </DrawerClose>
        </div>

        <div className='flex w-full flex-col items-center justify-center p-4'>
          <DrawerHeader className='sticky top-0 z-10 bg-white pb-2'>
            <DrawerTitle>Overview Chart Edit</DrawerTitle>
            <DrawerDescription>Customize your overview chart here.</DrawerDescription>
          </DrawerHeader>
          <div
            className='w-full overflow-y-auto'
            style={{ maxHeight: 'calc(85vh - 100px)' }}
          >
            <Carousel
              index={carouselIndex}
              onIndexChange={setCarouselIndex}
              className='w-full'
            >
              <CarouselContent className='w-full'>
                {editItems.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className='w-full p-1'>
                      <Card>
                        <CardContent className='flex w-full p-6'>
                          {editItems[index].component}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className='flex w-full justify-between'>
                {/* Replace CarouselPrevious and CarouselNext with buttons to intercept clicks */}
                <button
                  onClick={handlePrevious}
                  disabled={carouselIndex === 0}
                  className='btn btn-secondary'
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className='btn btn-primary'
                  disabled={editItems.length > 1 ? carouselIndex === editItems.length - 1 : false}
                >
                  Next
                </button>
              </div>
            </Carousel>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
