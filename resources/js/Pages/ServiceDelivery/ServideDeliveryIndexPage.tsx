import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useState } from 'react'
import Card from '@/ui/Card/Card'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'
import PendancyCard from '@/Components/Dashboard/PendancyCard'
import NewConnections from '@/Components/Dashboard/NewConnections'
import PowerInterruptionTrend from '@/Components/ServiceDelivery/PowerInterruptionTrend '
import Solar from '@/Components/ServiceDelivery/Solar/Solar'
import Complaints from '@/Components/ServiceDelivery/Issues/Complaints'
import SlaPerformance from '@/Components/ServiceDelivery/SLA/SlaPerformance'
import SolarGeneration from '@/Components/ServiceDelivery/Solar/SolarGeneration'

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
        <div className='flex flex-col gap-5 pl-10 pt-8 sm:pt-14'>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <ActiveConnection />
            <Card className=''>
              <NewConnections />
            </Card>
          </div>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <div className='flex w-full lg:w-2/3'>
              <SlaPerformance />
            </div>
            <div className='flex w-full lg:w-1/3'>
              <PendancyCard />
            </div>
          </div>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <div className='flex w-full lg:w-1/3'>
              <Complaints />
            </div>
            <div className='flex w-full lg:w-2/3'>
              <PowerInterruptionTrend />
            </div>
          </div>

          <div className='flex flex-col gap-2 lg:flex-row'>
            <div className='flex w-full lg:w-1/2'>
              <Solar />
            </div>
            <div className='flex w-full lg:w-1/2'>
              <SolarGeneration />
            </div>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
