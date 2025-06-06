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
import { ReactNode } from 'react'
import { Edit } from 'lucide-react'

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
        <div className='mx-auto flex max-h-[60vh] w-full max-w-3xl flex-col'>
          <DrawerHeader>
            <DrawerTitle>Data Tables</DrawerTitle>
            <DrawerDescription>Select one data table here.</DrawerDescription>
          </DrawerHeader>

          <div className='flex-1 overflow-y-auto px-4'>{children}</div>

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
