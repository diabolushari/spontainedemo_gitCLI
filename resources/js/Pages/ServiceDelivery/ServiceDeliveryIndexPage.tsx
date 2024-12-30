import NewConnections from '@/Components/Dashboard/NewConnections'
import PendancyCard from '@/Components/Dashboard/PendancyCard'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'
import Complaints from '@/Components/ServiceDelivery/Issues/Complaints'
import SlaPerformance from '@/Components/ServiceDelivery/SLA/SlaPerformance'
import Solar from '@/Components/ServiceDelivery/Solar/Solar'
import SolarGeneration from '@/Components/ServiceDelivery/Solar/SolarGeneration'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { useState } from 'react'

const ServiceDeliveryIndexPage = () => {
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
        <div className='flex flex-col gap-5 pt-8 sm:pt-14 md:pl-10'>
          <div className='grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-2'>
            <ActiveConnection />
            <NewConnections />
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
            <div className='flex w-full'>
              <Complaints />
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

export default ServiceDeliveryIndexPage
