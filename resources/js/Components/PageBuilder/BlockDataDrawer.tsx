'use client'

import { Button } from '@/Components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/Components/ui/drawer'
import { Edit } from 'lucide-react'
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
        <div className='mx-auto flex w-full max-w-3xl flex-col md:max-h-[80vh]'>
          <DrawerHeader>
            <DrawerTitle>Data Tables</DrawerTitle>
            <DrawerDescription>Select one data table here.</DrawerDescription>
          </DrawerHeader>
          <div className='flex overflow-y-auto'>{children}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
