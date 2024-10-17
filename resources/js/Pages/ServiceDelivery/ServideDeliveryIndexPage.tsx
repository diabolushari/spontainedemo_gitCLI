import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React from 'react'

const ServideDeliveryIndexPage = () => {
  return (
    <DashboardLayout>
      <DashboardPadding>
        <CardHeader
          title='CONNECTION'
          titleClassName='text-white'
        />
        <div className='ml-3 flex flex-col gap-5'>
          <div className='flex flex-col gap-5 md:flex-row'>
            <Card className=''>
              <div className=''>test</div>
            </Card>
            <Card className=''>
              <div className=''>test</div>
            </Card>
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            <Card className='w-full md:w-2/3'>
              <div className=''>test</div>
            </Card>
            <Card className='w-full md:w-1/3'>
              <div className=''>test</div>
            </Card>
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-1/3'>
              <Card className=''>
                <div className=''>test</div>
              </Card>
              <Card className=''>
                <div className=''>test</div>
              </Card>
              <Card className=''>
                <div className=''>test</div>
              </Card>
              <Card className=''>
                <div className=''>test</div>
              </Card>
            </div>
            <Card className='w-full md:w-2/3'>
              <div className=''>test</div>
            </Card>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
