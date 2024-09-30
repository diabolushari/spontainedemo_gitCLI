import { Link, router, usePage } from '@inertiajs/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '@/interfaces/data_interfaces'
import Tab from '@/ui/Tabs/Tab'
import dashboardMenuItems from '@/Layouts/dashboard-menu-items'

interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
  title?: string
}

export default function AnalyticsDashboardLayout({ children, type, subtype }: Properties) {
  const [activeTab, setActiveTab] = useState(type ?? 'data')
  const [activeHeading, setActiveHeading] = useState('manage')
  const [isProfileDropdown, setIsProfileDropdown] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

  // const tabs = [
  //   { name: 'Data Tables', value: 'data', url: '/data-detail?type=data&subtype=data-tables' },
  //   {
  //     name: 'Definitions',
  //     value: 'definitions',
  //     url: '/meta-data?type=definitions&subtype=metadata',
  //   },
  //   { name: 'Loaders', value: 'loaders', url: '/loader-jobs?type=loaders&subtype=jobs' },
  //   { name: 'Config', value: 'config', url: '/reference-data?type=config&subtype=reference-data' },
  // ]

  const headings = [
    { name: 'MANAGE', value: 'manage' },
    { name: 'DASHBOARD', value: 'dashboard' },
  ]

  // export default function AnalyticsDashboardLayout({ children, type, subtype }: Properties) {
  //   const [activeTab, setActiveTab] = useState(type ?? 'data')
  //   const [activeHeading, setActiveHeading] = useState('manage')
  //   const [isProfileDropdown, setIsProfileDropdown] = useState(false)

  const menuItems = useMemo(() => {
    return dashboardMenuItems.find((item) => item.value === activeTab)?.links ?? []
  }, [activeTab])

  // const profileRef = useRef<HTMLDivElement>(null)

  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const User = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : 'G'
  const userName = User?.name || 'Guest'

  const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setIsProfileDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const setTab = (tab: { name: string; value: string; url: string }) => {
    setActiveTab(tab.value)
    router.get(tab.url)
  }
  return (
    <div className='h-screen bg-white'>
      <div className='container mx-auto px-4 py-10'>
        {/* Flex container to align logo, headings, and profile picture */}
        <div className='flex items-center justify-between'>
          <div className='flex-shrink-0'>
            <img
              src='/one-stop-logo.png'
              alt='Logo'
            />
          </div>

          <div className='flex flex-grow justify-center space-x-12'>
            {headings.map((heading) => (
              <div
                key={heading.value}
                className={`cursor-pointer pb-2 tracking-widest ${activeHeading === heading.value ? 'font-bold text-1stop-highlight' : 'text-gray-600'}`}
                onClick={() => setActiveHeading(heading.value)}
              >
                <h1
                  className={`text-lg font-bold ${activeHeading === heading.value ? 'text-1stop-highlight' : 'text-gray-300'}`}
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
                className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-1stop-highlight text-2xl font-extrabold text-white hover:bg-1stop-accent1'
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
                className={`h-6 w-6 transform cursor-pointer duration-300 ${isProfileDropdown ? 'rotate-180' : ''}`}
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
              <div className='absolute right-0 mr-10 mt-2 w-48 rounded-md border border-gray-300 bg-white'>
                <div className='px-4 py-2'>
                  <p className='text-sm font-medium text-gray-900'>{userName}</p>
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
              // setActiveTab={setTa}
              onTabClick={setTab}
            />
            <div className='mt-8 flex flex-wrap gap-4 md:gap-1 lg:space-x-10'>
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className={`w-40 rounded-xl ${subtype === item.subtype ? 'bg-1stop-accent1' : 'bg-[#EFF0A6] hover:opacity-75'} p-8`}
                >
                  <Link
                    href={item.link}
                    className='text-black-600 flex flex-col items-center font-bold'
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
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
