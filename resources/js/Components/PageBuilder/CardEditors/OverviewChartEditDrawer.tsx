import { CardContent } from '@/Components/ui/card'
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
import { Save, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Config } from '@/interfaces/data_interfaces'

interface OverviewChartEditDrawerProps {
  open: boolean
  setOpen: (value: boolean) => void
  initialData: Partial<Config>
  blockId: number
}

export default function OverviewChartEditDrawer({
  open,
  setOpen,
  initialData,
  blockId,
}: Readonly<OverviewChartEditDrawerProps>) {
  const generalEditRef = useRef<OverviewChartGeneralEditHandle>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (generalEditRef.current) {
        await generalEditRef.current.submit()
        setOpen(false)
      }
    } catch (err) {
      alert('Save failed. Please check and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerContent className='h-full max-h-[85vh] duration-300'>
        <div className='absolute right-2 top-2 flex gap-2'>
          <Button
            variant='primary'
            label={isSaving ? 'Saving...' : 'Save'}
            icon={<Save />}
            onClick={handleSave}
            disabled={isSaving}
          />
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
            <div className='w-full p-1'>
              <Card>
                <CardContent className='flex w-full p-6'>
                  <OverviewChartGeneralEdit
                    ref={generalEditRef}
                    initialData={initialData}
                    blockId={blockId}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
