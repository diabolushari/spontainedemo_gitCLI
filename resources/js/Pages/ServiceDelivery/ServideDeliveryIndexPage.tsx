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
        <div className='flex flex-col gap-5 pt-24'>
          <div className='flex flex-row gap-2'>
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
          <div className='flex flex-col gap-2 md:flex-row'>
            <Card className='w-full p-10 md:w-2/3'>
              <SlaPerformance section_code={sectionCode} />
            </Card>
            <Card className='w-full md:w-1/3'>
              <PendancyCard />
            </Card>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default ServideDeliveryIndexPage
