'use client'

import { Button } from '@/Components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/Components/ui/drawer'
import { Edit, X } from 'lucide-react'
import { ReactNode } from 'react'

interface BlockDataDrawerProps {
  children: ReactNode
  open: boolean
  setOpen: (value: boolean) => void
}

export function BlockDataDrawer({ children, open, setOpen }: BlockDataDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button className='absolute bottom-0 right-0 z-10 bg-blue-500 p-4 hover:bg-blue-700'>
          <Edit />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className='relative mx-auto flex h-full w-full flex-col md:max-h-[80vh]'>
          {/* Close button on top-right */}
          <DrawerClose asChild>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-2 mr-4 rounded-full bg-red-300 hover:bg-red-500 hover:text-white'
            >
              <X className='h-5 w-5' />
            </Button>
          </DrawerClose>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
