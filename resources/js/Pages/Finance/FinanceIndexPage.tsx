import TotalBilled from '@/Components/Finance/TotalBilled'
import TotalCollected from '@/Components/Finance/TotalCollected'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import React, { useState } from 'react'
const FinanceIndexPage = () => {
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
      type='FINANCIAL STATS'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-5 pl-10 pt-8 sm:pt-24'>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Card className=''>
              <TotalBilled
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
            <Card className=''>
              <TotalCollected
                section_code={sectionCode}
                levelCode={levelCode}
                levelName={levelName}
              />
            </Card>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'></div>
          <div className='flex flex-col gap-2 sm:flex-row'></div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default FinanceIndexPage
