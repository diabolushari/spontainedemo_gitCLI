import React from 'react'
import MoreButton from '../MoreButton'
import { Link } from '@inertiajs/react'
import Card from '@/ui/Card/Card'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

const Outages = ({ section_code, levelName, levelCode }: Properties) => {
  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='flex w-full flex-col space-x-1 sm:flex-row'>
        <div className='flex'>
          <div className='ml-5 flex-col'>
            <p>2.32 K</p>
            <p className='small-1stop-header mt-5'>AVERAGE MONTHLY </p>
            <p className='small-1stop-header'>OUTAGE DURATION </p>
            <p className='small-1stop-header'>(HOURS) </p>
          </div>
          <div className='ml-5 flex-col'>
            <p>8,978</p>
            <p className='small-1stop-header mt-5'> MONTHLY AVERAGE</p>
            <p className='small-1stop-header'>CONSUMERS AFFECTED </p>
          </div>
        </div>
      </div>
      <div className='flex justify-end hover:cursor-pointer hover:opacity-50'>
        <Link href=''>
          <MoreButton />
        </Link>
      </div>
    </Card>
  )
}

export default Outages
