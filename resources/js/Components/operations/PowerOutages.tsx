import React from 'react'
import Card from '@/ui/Card/Card'
import MoreButton from '../MoreButton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'

interface Properties {
  section_code?: string
  levelName: string
  levelCode: string
}

const PowerOutages = ({ section_code, levelName, levelCode }: Properties) => {
  return (
    <Card className='flex w-full flex-col space-x-1 p-4'>
      <div className='flex w-full flex-col space-x-1 sm:flex-row'>
        <div className='flex w-1/2 flex-col gap-12 pt-3'>
          <p className='subheader-1stop'>POWER OUTAGES</p>
          <div className='flex flex-col'>
            <p className='xlmetric-1stop'>124</p>
            <p className=''>TOTAL OUTAGES </p>
          </div>
          <div className='flex'>
            <div className='flex flex-col'>
              <p className='h3-1stop'>6</p>
              <p className='small-1stop'>SCHEDULED</p>
            </div>
            <div className='flex flex-col'>
              <p className='h3-1stop ml-5'>10</p>
              <p className='small-1stop ml-5'>UNSCHEDULED</p>
            </div>
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
export default PowerOutages
