import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'
import SlaPerformance from '@/Components/Dashboard/SlaPerformance'
import PendancyCard from '@/Components/Dashboard/PendancyCard'
import NewConnections from '@/Components/Dashboard/NewConnections'

const ServideDeliveryIndexPage = () => {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  return (
    <DashboardLayout
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
    >
      <DashboardPadding>
        {/* <CardHeader
          title='CONNECTION'
          titleClassName='text-white'
        /> */}
        <div className='flex flex-col gap-5 pt-24'>
          <div className='flex flex-row gap-2'>
            {/* <div className='flex w-full flex-row bg-white'>
              <div className='flex flex-col p-5'>
                <div>
                  <p className='h1-1stop'>100</p>
                  <p className='body-1stop'>Total Active Connections</p>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col'>
                    <p className='h3-1stop'>10</p>
                    <p className='small-1stop'>LT</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='h3-1stop'>20</p>
                    <p className='small-1stop'>HT</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex w-full flex-row bg-white'>
              <div className='flex flex-col p-5'>
                <div>
                  <p className='h1-1stop'>100</p>
                  <p className='body-1stop'>Total Active Connections</p>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col'>
                    <p className='h3-1stop'>10</p>
                    <p className='small-1stop'>LT</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='h3-1stop'>20</p>
                    <p className='small-1stop'>HT</p>
                  </div>
                </div>
              </div>
            </div> */}

            <ActiveConnection
              section_code={sectionCode}
              levelCode={levelCode}
              levelName={levelName}
            />
            <Card className=''>
              <NewConnections section_code={sectionCode} />
            </Card>
          </div>
          <div className='flex flex-col gap-2 md:flex-row'>
            <Card className='w-full p-10 md:w-2/3'>
              <SlaPerformance section_code={sectionCode} />
            </Card>
            <Card className='w-full md:w-1/3'>
              <PendancyCard />
            </Card>
          </div>
          {/* <div className='flex flex-col gap-2 md:flex-row'>
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
          </div> */}
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
