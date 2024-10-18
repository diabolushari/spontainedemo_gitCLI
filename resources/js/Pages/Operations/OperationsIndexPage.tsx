import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React from 'react'

const OperationsIndexPage = () => {
  return (
    <DashboardLayout type='operations'>
      <DashboardPadding>
        <div className=''>Operations</div>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default OperationsIndexPage
