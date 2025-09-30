import { Drawer, DrawerClose, DrawerContent } from '@/Components/ui/drawer'
import Button from '@/ui/button/Button'
import { X } from 'lucide-react'
import ConfigFormStepTrend from '@/Components/PageBuilder/PageBlockConfigFormComponent/ConfigFormStepTrend'

interface TrendEditDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  block: any
  initialData: any
  onDataUpdate?: (updatedData: any) => void // Add this for parent updates
}

export default function TrendEditDrawer({
  open,
  setOpen,
  block,
  initialData,
  onDataUpdate,
}: TrendEditDrawerProps) {
  const handleNext = (updatedData: any) => {
    // Handle successful form submission
    console.log('Form submitted successfully:', updatedData)

    // Update parent component if callback provided
    if (onDataUpdate) {
      onDataUpdate(updatedData)
    }

    // Close the drawer
    setOpen(false)
  }

  const handleBack = () => {
    // Handle back navigation (if needed)
    // For now, just close the drawer
    setOpen(false)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerContent>
        <div className='absolute right-2 top-2 flex gap-2'>
          <DrawerClose asChild>
            <Button
              variant='danger'
              label=''
              icon={<X />}
              onClick={handleDrawerClose}
            />
          </DrawerClose>
        </div>
        <div className='px-4 pb-4'>
          <ConfigFormStepTrend
            initialData={initialData}
            block={block}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
