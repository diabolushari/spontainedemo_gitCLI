'use client'

import Card from '@/ui/Card/Card'
import { Block } from '@/interfaces/data_interfaces'
import CardHeader from '@/ui/Card/CardHeader'

export function SampleChart({
  block,
  dimensions,
}: {
  block?: Block
  dimensions?: Record<string, string>
}) {
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
      <Card className='rounded rounded-md'>
        <CardHeader title={block ? block.name : 'Sample'} />
        <p>{classNames}</p>
        <div>This is a sample card. Just for demo purpose.</div>
      </Card>
    </div>
  )
}
