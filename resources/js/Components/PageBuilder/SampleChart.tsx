'use client'

import { useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { Block } from '@/interfaces/data_interfaces'
import { BlockHeader } from './BlockHeader'
import { CustomPieChart } from '../Charts/SampleChart/CustomPieChart'

export function SampleChart({
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

  const ContentComponent = <CustomPieChart />

  return (
    <div className={classNames}>
      <Card className='rounded rounded-md'>
        <CardHeader title={block ? block.data?.name : 'Sample'} />
        <div className=''>{JSON.stringify(block?.data?.name)}</div>
        <BlockHeader
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
        <div className='mt-4'>{ContentComponent}</div>
      </Card>
    </div>
  )
}
