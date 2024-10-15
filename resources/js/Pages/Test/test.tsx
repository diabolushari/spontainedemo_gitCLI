import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import React from 'react'

const test = () => {
  return (
    <DashboardLayout>
      <DashboardPadding>
        <Card className='mt-10'>
          <div className=''>test</div>
          <div className=''>test</div>
        </Card>
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default test
