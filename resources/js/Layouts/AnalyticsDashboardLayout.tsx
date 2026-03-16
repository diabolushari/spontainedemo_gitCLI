import { router, usePage } from '@inertiajs/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '@/interfaces/data_interfaces'
import dashboardMenuItems from '@/Layouts/dashboard-menu-items'
import MetaTags from '@/Components/MetaTags'
import { showError, showSuccess } from '@/ui/alerts'
import { ToastContainer } from 'react-toastify'
import ApplicationLogo from '@/Components/ApplicationLogo'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar'
import { AppSidebar } from '@/Components/app-sidebar'
import AdminLayoutPadding from './AdminLayoutPadding'

interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
  title?: string
  description?: string
  handleCardRef?: () => void
}

export default function AnalyticsDashboardLayout({
  children,
  type,
  subtype,
  title,
  description,
  handleCardRef,
}: Properties) {
  const [activeTab, setActiveTab] = useState(type ?? 'data')
  const [activeHeading, setActiveHeading] = useState('manage')
  const [isProfileDropdown, setIsProfileDropdown] = useState(false)

  const sessionFlash = usePage().props.flash as unknown as {
    message: string | null
    error: string | null
  }

  useEffect(() => {
    if (sessionFlash.message != null) {
      showSuccess(sessionFlash.message)
    }
    if (sessionFlash.error != null) {
      showError(sessionFlash.error)
    }
  }, [sessionFlash])

  const profileRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const headings = [
    { name: 'MANAGE', value: 'manage', url: '/data-detail' },
    { name: 'DASHBOARD', value: 'dashboard', url: '/service-delivery' },
  ]

  const menuItems = useMemo(() => {
    return dashboardMenuItems.find((item) => item.value === activeTab)?.links ?? []
  }, [activeTab])

  const findDescription = (tabName: string) => {
    return dashboardMenuItems.find((item) => item.value === activeTab)?.tabDescription
  }
  const userInfo = usePage().props.auth as unknown as { user: User }
  const User = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : ''
  const userName = User?.name || ''

  const changeTab = (newTab: string) => {
    setActiveTab(newTab)
    const tabInfo = dashboardMenuItems.find((tab) => tab.value === newTab)
    if (tabInfo != null && tabInfo.url != null) {
      router.get(tabInfo.url)
    }
  }

  useEffect(() => {
    cardRef.current?.click()
  }, [])

  const handleScroll = () => {
    if (handleCardRef != null) {
      handleCardRef()
    }
  }
  return (
    <SidebarProvider
      defaultOpen={false}
      className='flex flex-col bg-white pl-1 md:pl-8'
    >
      <MetaTags
        title={title}
        description={description}
      />
      <ToastContainer />
      <div className='sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm backdrop-blur-lg'>
        <SidebarTrigger className='md:ml-10' />
        <img
          src={User?.organization?.logo ?? '/spontaine-favicon.png'}
          alt='logo'
          className='h-12 w-12'
        />
        {/* <ApplicationLogo className='mb-2 h-20 w-auto rounded-2xl md:h-16' /> */}
      </div>

      <AppSidebar className='z-40' />
      <SidebarInset>
        <AdminLayoutPadding>
          <div>{children}</div>
        </AdminLayoutPadding>
      </SidebarInset>
    </SidebarProvider>
  )
}
