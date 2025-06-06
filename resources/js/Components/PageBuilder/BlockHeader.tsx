import { Label } from '@/Components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'

export function BlockHeader({
  selectedView,
  setSelectedView,
}: {
  selectedView: string
  setSelectedView: (value: string) => void
}) {
  return (
    <RadioGroup
      value={selectedView}
      onValueChange={setSelectedView}
    >
      <div className='grid grid-cols-3'>
        <div className='flex items-center gap-3'>
          <RadioGroupItem
            value='overview'
            id='r1'
          />
          <Label htmlFor='r1'>Overview</Label>
        </div>
        <div className='flex items-center gap-3'>
          <RadioGroupItem
            value='trend'
            id='r2'
          />
          <Label htmlFor='r2'>Trend</Label>
        </div>
        <div className='flex items-center gap-3'>
          <RadioGroupItem
            value='rank'
            id='r3'
          />
          <Label htmlFor='r3'>Rank</Label>
        </div>
      </div>
    </RadioGroup>
  )
}
