import Outages from '@/Components/operations/Outages'
import PowerOutages from '@/Components/operations/PowerOutages'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import React, { useState } from 'react'

const OperationsIndexPage = () => {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  return (
    <DashboardLayout
      type='OPERATIONS'
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
    >
      <DashboardPadding>
        <div className='flex flex-col gap-5 pl-10 pt-8 sm:pt-24'>
          <div className='flex gap-2 lg:flex-row'>
            <PowerOutages
              section_code={sectionCode}
              levelCode={levelCode}
              levelName={levelName}
            />
            <Card className='w-1/3'>
              <Outages
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

export default OperationsIndexPage
