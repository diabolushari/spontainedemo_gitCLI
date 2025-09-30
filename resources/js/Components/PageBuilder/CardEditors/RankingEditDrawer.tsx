import { Drawer, DrawerClose, DrawerContent } from '@/Components/ui/drawer'
import Button from '@/ui/button/Button'
import { X } from 'lucide-react'
import ConfigFormStepRanking from '@/Components/PageBuilder/PageBlockConfigFormComponent/ConfigFormStepRanking'

interface RankingEditDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  block: any
  initialData: any
  onDataUpdate?: (updatedData: any) => void
}

export default function RankingEditDrawer({
  open,
  setOpen,
  block,
  initialData,
  onDataUpdate,
}: RankingEditDrawerProps) {
  const handleNext = (updatedData: any) => {
    // Handle successful form submission
    console.log('Ranking form submitted successfully:', updatedData)

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
        <div className='grid place-content-end pr-5'>
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
          <ConfigFormStepRanking
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
