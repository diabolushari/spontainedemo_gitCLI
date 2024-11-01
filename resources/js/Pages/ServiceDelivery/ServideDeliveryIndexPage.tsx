import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useEffect, useState } from 'react'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import ActiveConnection from '@/Components/ServiceDelivery/ActiveConnection'
import SlaPerformance from '@/Components/Dashboard/SlaPerformance'
import PendancyCard from '@/Components/Dashboard/PendancyCard'
import NewConnections from '@/Components/Dashboard/NewConnections'
import IssueCard from '@/Components/ServiceDelivery/IssueCard'
import PowerInterruptionTrend from '@/Components/ServiceDelivery/PowerInterruptionTrend '

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
            <ActiveConnection
              section_code={sectionCode}
              levelCode={levelCode}
              levelName={levelName}
            />
            <Card className=''>
              <NewConnections
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Card className='w-full p-6 sm:w-2/3 sm:p-10'>
              <SlaPerformance
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
            <Card className='w-full p-6 sm:w-1/3 sm:p-4'>
              <PendancyCard
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Card className='w-2/5 p-6 sm:w-1/3 sm:p-4'>
              <IssueCard
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
            <Card className='w-3/5 flex-grow p-6 sm:p-4'>
              <PowerInterruptionTrend
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
