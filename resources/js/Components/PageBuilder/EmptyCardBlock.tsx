import { useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { Block } from '@/interfaces/data_interfaces'
import { BlockRadioGroup } from './BlockRadioGroup'

export function EmptyCardBlock({
  block,
  dimensions,
}: {
  block?: Block
  dimensions?: Record<string, string>
}) {
  const [selectedView, setSelectedView] = useState('overview')

  const classNames = [
    dimensions?.padding_top,
    dimensions?.padding_bottom,
    dimensions?.margin_top,
    dimensions?.margin_bottom,
    dimensions?.mobile_width,
    dimensions?.tablet_width,
    dimensions?.laptop_width,
    dimensions?.desktop_width,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames}>
      <Card className='min-h-24 rounded-md'>
        <CardHeader title={block ? block.data?.title : 'Sample'} />
        <div className=''>{JSON.stringify(block?.data?.title)}</div>
        <BlockRadioGroup
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
        <div className='mt-4'></div>
      </Card>
    </div>
  )
}
