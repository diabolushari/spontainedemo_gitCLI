import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import { Link } from '@inertiajs/react'
import React, { useState } from 'react'

export default function Index() {
  const [activeTab, setActiveTab] = useState('data')
  const [activeHeading, setActiveHeading] = useState('manage')

  const tabs = [
    { name: 'Data Tables', value: 'data' },
    { name: 'Definitions', value: 'definitions' },
    { name: 'Loaders', value: 'loaders' },
    { name: 'Config', value: 'config' },
  ]

  const headings = [
    { name: 'MANAGE', value: 'manage' },
    { name: 'DASHBOARD', value: 'dashboard' },
  ]

  return <AnalyticsDashboardLayout></AnalyticsDashboardLayout>
}
