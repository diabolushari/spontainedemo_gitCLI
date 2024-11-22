import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useEffect, useState } from 'react'
import Card from '@/ui/Card/Card'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'
import SlaPerformance from '@/Components/Dashboard/SlaPerformance'
import PendancyCard from '@/Components/Dashboard/PendancyCard'
import NewConnections from '@/Components/Dashboard/NewConnections'
import IssueCard from '@/Components/ServiceDelivery/IssueCard'
import PowerInterruptionTrend from '@/Components/ServiceDelivery/PowerInterruptionTrend '
import SolarCapacityTrend from '@/Components/Dashboard/SolarCapacityTrend'

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
        <div className='flex flex-col gap-5 pl-10 pt-8 sm:pt-24'>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <ActiveConnection />
            <Card className=''>
              <NewConnections />
            </Card>
          </div>
          <div className='flex flex-col items-stretch gap-2 lg:flex-row'>
            <div className='flex w-full flex-col p-6 sm:p-4 lg:w-2/3'>
              <SlaPerformance />
            </div>
            <div className='flex w-full flex-col p-6 sm:p-4 lg:w-1/3'>
              <PendancyCard />
            </div>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Card className='w-full p-6 sm:p-4 lg:w-1/3'>
              <IssueCard
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
            <Card className='flex w-full p-6 sm:p-4 lg:w-2/3'>
              <PowerInterruptionTrend
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
          </div>
          <div className='w-1/2'>
            <SolarCapacityTrend />
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
