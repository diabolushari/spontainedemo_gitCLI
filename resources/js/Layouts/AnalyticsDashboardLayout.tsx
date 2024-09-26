import { Link, usePage } from '@inertiajs/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '@/interfaces/data_interfaces'

interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
}

export default function AnalyticsDashboardLayout({ children, type, subtype }: Properties) {
  const [activeTab, setActiveTab] = useState(type ?? 'data')
  const [activeHeading, setActiveHeading] = useState('manage')
  const [isProfileDropdown, setIsProfileDropdown] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className='bg-white h-screen'>
      <div className='container mx-auto px-4 py-10'>
        {/* Flex container to align logo, headings, and profile picture */}
        <div className='flex items-center justify-between'>
          <div className='flex-shrink-0'>
            <img
              src='/one-stop-logo.png'
              alt='Logo'
            />
          </div>

          <div className='flex flex-grow justify-center space-x-4'>
            {headings.map((heading) => (
              <div
                key={heading.value}
                className={`cursor-pointer pb-2 ${activeHeading === heading.value ? 'font-bold text-green-700' : 'text-gray-600'}`}
                onClick={() => setActiveHeading(heading.value)}
              >
                <p
                  className={`text-lg font-bold ${activeHeading === heading.value ? 'text-green-700' : 'text-gray-600'}`}
                >
                  {heading.name}
                </p>
              </div>
            ))}
          </div>

          <div
            className='relative flex-shrink-0'
            ref={profileRef}
          >
            <div
              className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-700 text-white'
              onClick={() => setIsProfileDropdown(!isProfileDropdown)}
            >
              {userInitial}
            </div>
            {isProfileDropdown && (
              <div className='absolute right-0 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg'>
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
          <div className='mt-4'>
            <div className='items-center border-b border-gray-200 sm:flex'>
              {tabs.map((tab) => (
                <div
                  key={tab.value}
                  className={`group mr-16 flex cursor-pointer items-center border-b pb-5 ${
                    activeTab === tab.value
                      ? 'border-green-700'
                      : 'border-transparent hover:border-green-700'
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <p
                    className={`text-lg font-extrabold leading-none ${activeTab === tab.value ? 'text-green-700' : 'text-gray-600 group-hover:text-green-700'}`}
                  >
                    {tab.name}
                  </p>
                </div>
              ))}
            </div>

            {activeTab === 'definitions' && (
              <div className='mt-4 flex gap-4 space-x-4 md:gap-1'>
                <div
                  className={`metadatalogo rounded-xl ${subtype === 'metadata' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/meta-data?type=definitions&subtype=metadata'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                      src='/metadata.png'
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>METADATA</span>
                  </Link>
                </div>
                <div
                  className={`groupslogo rounded-xl ${subtype === 'groups' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/meta-data-group?type=definitions&subtype=groups'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-2 md:h-20 md:w-20'
                      src='/groups.png'
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>GROUPS</span>
                  </Link>
                </div>
                <div
                  className={`hierarchylogo rounded-xl ${subtype === 'heirarchies' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/meta-hierarchy?type=definitions&subtype=heirarchies'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-2 md:h-20 md:w-20'
                      src='/hierarchies.png'
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>HIERARCHIES</span>
                  </Link>
                </div>
                <div
                  className={`hierarchylogo rounded-xl ${subtype === 'blocks' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/meta-structure?type=definitions&subtype=blocks'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      src='/structblock.png'
                      alt=''
                      className='flex h-10 w-10 items-center justify-center md:h-20 md:w-20'
                    />
                    <span className='flex max-w-16 pt-1 text-center text-xs'>
                      STRUCTURAL BLOCKS
                    </span>
                  </Link>
                </div>
              </div>
            )}
            {activeTab === 'loaders' && (
              <div className='mt-4 flex gap-4 space-x-4 md:gap-1'>
                <div
                  className={`metadatalogo rounded-xl ${subtype === 'data-sources' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/loader-connections?type=loaders&subtype=data-sources'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                      src='/data-sources.png'
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>DATA SOURCES</span>
                  </Link>
                </div>
                <div
                  className={`metadatalogo rounded-xl ${subtype === 'jobs' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/loader-jobs?type=loaders&subtype=jobs'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                      src='/jobs.png'
                      alt=''
                    />
                    <span className='pt-1 text-center text-xs'>JOBS</span>
                  </Link>
                </div>
                <div
                  className={`metadatalogo rounded-xl ${subtype === 'queries' ? 'bg-[#E3FE3C]' : 'bg-[#EFF0A6]'} p-8`}
                >
                  <Link
                    href='/loader-queries?type=loaders&subtype=queries'
                    className='text-black-600 flex flex-col font-bold hover:text-green-700'
                  >
                    <img
                      className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                      src='/extraction.png'
                      alt=''
                    />
                    <span className='max-w-16 pt-1 text-center text-xs'>EXTRACTION STATEMENTS</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
