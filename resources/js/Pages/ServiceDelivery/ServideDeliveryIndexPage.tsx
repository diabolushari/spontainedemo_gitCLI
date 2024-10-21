import RequestsCompleted from '@/Components/Dashboard/RequestsCompleted'
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
              <div className='rounded-xl bg-white p-4 shadow-md'>
                <RequestsCompleted />
              </div>
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
                <div className='h1-1stop pt-5 text-center'>423</div>
                <div className='body-1stop pb-3 pt-4 text-center'>Faulty Meters</div>
              </Card>
              <Card className='grid grid-cols-2 gap-4 p-5'>
                <div className='flex flex-col'>
                  <div className='h3-1stop pl-4'>76</div>
                  <div className='small-1stop pl-4'>&lt;30d</div>
                </div>
                <div className='flex flex-col'>
                  <div className='h3-1stop text-[#FCB216]'>322</div>
                  <div className='small-1stop'>&gt;30d</div>
                </div>
                <div className='col-span-2 flex flex-row'>
                  <div className='small-1stop pl-4'>Meters: Faulty Days</div>
                </div>
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
