import { Link, router, usePage } from '@inertiajs/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '@/interfaces/data_interfaces'
import Tab from '@/ui/Tabs/Tab'
import dashboardMenuItems from '@/Layouts/dashboard-menu-items'
import MetaTags from '@/Components/MetaTags'

interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
  title?: string
  description?: string
}

export default function AnalyticsDashboardLayout({
  children,
  type,
  subtype,
  title,
  description,
}: Properties) {
  const [activeTab, setActiveTab] = useState(type ?? 'data')
  const [activeHeading, setActiveHeading] = useState('manage')
  const [isProfileDropdown, setIsProfileDropdown] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

  const headings = [
    { name: 'MANAGE', value: 'manage' },
    { name: 'DASHBOARD', value: 'dashboard' },
  ]

  const menuItems = useMemo(() => {
    return dashboardMenuItems.find((item) => item.value === activeTab)?.links ?? []
  }, [activeTab])

  const findDescription = (tabName: string) => {
    return dashboardMenuItems.find((item) => item.value === activeTab)?.tabDescription
  }
  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const User = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : 'G'
  const userName = User?.name || 'Guest'

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
  //     setIsProfileDropdown(false)
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  const changeTab = (newTab: string) => {
    setActiveTab(newTab)
    const tabInfo = dashboardMenuItems.find((tab) => tab.value === newTab)
    if (tabInfo != null && tabInfo.url != null) {
      router.get(tabInfo.url)
    }
  }

  return (
    <div className='min-h-screen'>
      <MetaTags
        title={title}
        description={description}
      />
      <div className='mx-auto mt-4 flex w-11/12 flex-col px-4 py-10 2xl:w-10/12'>
        {/* Flex container to align logo, headings, and profile picture */}
        <div className='flex items-center justify-between'>
          <div className='flex-shrink-0'>
            <Link
              href='/meta-structure'
              className='cursor-pointer hover:opacity-50'
            >
              <img
                src='/one-stop-logo.png'
                alt='Logo'
              />
            </Link>
          </div>

          <div className='flex flex-col justify-center px-1 md:flex-row md:space-x-12'>
            {headings.map((heading) => (
              <div
                key={heading.value}
                className={`cursor-pointer pb-2 tracking-widest ${activeHeading === heading.value ? 'font-bold text-1stop-highlight' : 'text-gray-600'}`}
                onClick={() => setActiveHeading(heading.value)}
              >
                <h1
                  className={`font-h1stop text-center text-lg ${activeHeading === heading.value ? 'text-1stop-highlight' : 'text-gray-300'}`}
                >
                  {heading.name}
                </h1>
              </div>
            ))}
          </div>
          <div>
            <div
              className='relative flex flex-shrink-0 items-center'
              ref={profileRef}
            >
              <div
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-1stop-highlight font-h1-stop text-xl text-white hover:bg-1stop-accent1 hover:text-black md:h-12 md:w-12 md:text-2xl'
                onClick={() => setIsProfileDropdown(!isProfileDropdown)}
              >
                {userInitial}
              </div>

              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={`h-5 w-5 transform cursor-pointer duration-300 md:h-6 md:w-6 ${isProfileDropdown ? 'rotate-180' : ''}`}
                onClick={() => setIsProfileDropdown(!isProfileDropdown)}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                />
              </svg>
            </div>
            {isProfileDropdown && (
              <div className='absolute mr-10 mt-2 w-48 rounded-md border border-gray-300 bg-white'>
                <div className='px-4 py-2'>
                  <p className='font-h2-1stop text-gray-900'>Logged in as {userName}</p>
                </div>
                <div className='border-t border-gray-200'></div>
                <div className='py-2'>
                  <Link
                    href='/logout'
                    method='post'
                    className='text-black-700 block w-full px-4 py-2 text-left hover:bg-gray-100'
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeHeading === 'manage' && (
          <div className='mt-10'>
            <Tab
              tabItems={dashboardMenuItems}
              activeTab={activeTab}
              setActiveTab={changeTab}
            />
            <div className='mt-8 flex flex-wrap gap-4 md:gap-1 lg:space-x-10'>
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className={`w-40 rounded-xl ${subtype === item.subtype ? 'bg-1stop-accent1' : 'bg-[#EFF0A6] hover:opacity-50'} p-8`}
                >
                  <Link
                    href={item.link}
                    className='text-black-600 flex flex-col items-center font-h3-1stop'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                      src={item.image}
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>{item.title}</span>
                  </Link>
                </div>
              ))}
            </div>
            <div className='mt-10 text-sm'>{findDescription(activeTab)}</div>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
