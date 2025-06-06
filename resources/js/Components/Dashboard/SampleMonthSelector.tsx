import React from 'react'
import { Button } from '@/Components/ui/button'

interface Props {
  selectedValue: number
  setSelectedValue: (value: number) => void
}

export default function SampleMonthSelector({ selectedValue, setSelectedValue }: Readonly<Props>) {
  return (
    <div className='flex gap-4'>
      <Button
        variant={selectedValue === 2 ? 'default' : 'outline'}
        onClick={() => setSelectedValue(2)}
      >
        3 M
      </Button>
      <Button
        variant={selectedValue === 5 ? 'default' : 'outline'}
        onClick={() => setSelectedValue(5)}
      >
        6 M
      </Button>
      <Button
        variant={selectedValue === 11 ? 'default' : 'outline'}
        onClick={() => setSelectedValue(11)}
      >
        1 Y
      </Button>
    </div>
  )
}
