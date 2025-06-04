'use client'

import { useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { Block } from '@/interfaces/data_interfaces'
import { BlockHeader } from './BlockHeader'
import { CustomLineChart } from '../Charts/SampleChart/CustomLineChart'
import { CustomBarChart } from '../Charts/SampleChart/CustomBarChart'
import { CustomPieChart } from '../Charts/SampleChart/CustomPieChart'
import Button from '@/ui/button/Button'

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

  let ContentComponent
  if (selectedView === 'overview') ContentComponent = <CustomPieChart />
  else if (selectedView === 'trend') ContentComponent = <CustomLineChart />
  else if (selectedView === 'rank') ContentComponent = <CustomBarChart />
  return (
    <div className={classNames}>
      <Card className='rounded rounded-md'>
        <CardHeader title={block ? block.name : 'Sample'} />
        <BlockHeader
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
        <div className='mt-4'>{ContentComponent}</div>
        <Button
          type='button'
          label='explore'
        />
      </Card>
    </div>
  )
}
