import Reliability from '@/Components/Operation/Reliability'
import ServiceOutages from '@/Components/Operation/ServiceOutages'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useState } from 'react'

const OperationsIndexPage = () => {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  return (
    <DashboardLayout
      type='operations'
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
    >
      <DashboardPadding>
        <div className='flex flex-col gap-5 pt-8 sm:pt-14 md:pl-10'>
          <div className='lg:flex-roww-full flex flex-col gap-2'>
            <Reliability />
          </div>
          <div className='grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-2'>
            <ServiceOutages />
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default OperationsIndexPage
