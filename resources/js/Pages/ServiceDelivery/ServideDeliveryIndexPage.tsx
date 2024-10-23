import RequestsCompleted from '@/Components/Dashboard/RequestsCompleted'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import SelectList from '@/ui/form/SelectList'
import InactiveGraph from '@/Components/ServiceDelivery/Graphs/InactiveGraph'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'

const ServideDeliveryIndexPage = () => {
  const [title, setTitle] = useState('')
  const categoryList = [{ name: 'test 1' }, { name: 'test 2' }]
  const tariffList = [{ name: 'test 1' }, { name: 'test 2' }]
  const [sectionCode, setSectionCode] = useState('')
  return (
    <DashboardLayout
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
    >
      <DashboardPadding>
        <CardHeader
          title='CONNECTION'
          titleClassName='text-white'
        />
        <div className='ml-3 flex flex-col gap-5'>
          <div className='flex flex-col gap-5 md:flex-row'>
            <ActiveConnection section_code={sectionCode} />
            <Card className=''>
              <RequestsCompleted />
            </Card>
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            <Card className='w-full p-10 md:w-2/3'>
              <div className='h3-1stop'>Category-wise SLA Performance</div>
              <div className='pt-7'>
                <img
                  src='SLA Performance.png'
                  alt=''
                />
              </div>
            </Card>
            <Card className='w-full md:w-1/3'>
              <div className='h3-1stop pl-10 pt-10'>Pendancy Beyond SLA</div>
              <div className='flex w-full flex-col gap-2 p-2'>
                <div className='flex justify-end'>
                  <div className='mr-7 flex w-48 flex-col'>
                    <SelectList
                      setValue={() => setTitle}
                      list={categoryList}
                      dataKey='name'
                      displayKey='name'
                      label='ALL CATEGORIES'
                      showAllOption
                      value={title}
                    />
                  </div>
                </div>
                <div className='flex justify-end'>
                  <div className='mr-7 flex w-48 flex-col pt-2'>
                    <SelectList
                      setValue={() => setTitle}
                      list={tariffList}
                      dataKey='name'
                      displayKey='name'
                      label='ALL TARIFFS'
                      showAllOption
                      value={title}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-center p-5'>
                <img
                  src='SLA.png'
                  alt=''
                />
              </div>
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
