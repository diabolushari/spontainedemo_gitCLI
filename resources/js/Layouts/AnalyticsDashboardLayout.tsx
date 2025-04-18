import { Link, router, usePage } from '@inertiajs/react'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '@/interfaces/data_interfaces'
import Tab from '@/ui/Tabs/Tab'
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
      {/* <div className='mx-2 my-0 min-h-screen rounded-2xl bg-1stop-background md:mx-6 md:my-6'> */}
      <MetaTags
        title={title}
        description={description}
      />
      <ToastContainer />
      <div className='sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm backdrop-blur-lg'>
        <SidebarTrigger className='md:ml-10' />
        <ApplicationLogo className='mb-2 h-20 w-auto rounded-2xl md:h-16' />
      </div>

      <AppSidebar className='z-40' />
      <SidebarInset>
        <AdminLayoutPadding>
          {/* <div className='mt-4 hidden w-full flex-col px-5 py-10 sm:flex'>
            <div className='flex flex-col items-center justify-between gap-5 sm:flex-row sm:gap-0'>
              <div className='flex-shrink-0'>
                <Link
                  href='/meta-structure'
                  className='cursor-pointer hover:opacity-50'
                >
                  <ApplicationLogo className='h-24 w-auto rounded-2xl' />
                </Link>
              </div>

              <div className='flex flex-col items-center justify-center px-1 sm:flex-row sm:space-x-12'>
                {headings.map((heading) => (
                  <div
                    key={heading.value}
                    className={`cursor-pointer pb-2 tracking-widest ${activeHeading === heading.value ? 'subheader-1stop 1stop-highlight' : '1stop-gray'}`}
                    onClick={() => setActiveHeading(heading.value)}
                  >
                    <Link href={heading.url}>
                      <h1
                        className={`subheader-1stop ${activeHeading === heading.value ? 'text-1stop-highlight' : 'text-1stop-gray'}`}
                      >
                        {heading.name}
                      </h1>
                    </Link>
                  </div>
                ))}
              </div>
              <div>
                <div
                  className='flex flex-shrink-0 items-center justify-center sm:relative sm:justify-normal'
                  ref={profileRef}
                >
                  <div
                    className='h1-stop flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-1stop-highlight text-2xl text-white hover:text-black'
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
                  <div className='flex justify-center'>
                    <div className='bg:opacity-100 z-50 mt-4 w-48 rounded-xl border border-1stop-highlight bg-1stop-white p-2 shadow sm:absolute sm:right-10'>
                      <div className='px-4 py-2'>
                        <p className='small-1stop text-gray-900'>Logged in as {userName}</p>
                      </div>
                      <hr />
                      <div className='py-2'>
                        <Link
                          href='/logout'
                          method='post'
                          className='text-black-700 small-1stop flex w-full rounded px-4 py-2 text-left hover:bg-1stop-gray'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='icon icon-tabler icon-tabler-logout'
                            width={20}
                            height={20}
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            fill='none'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path
                              stroke='none'
                              d='M0 0h24v24H0z'
                            />
                            <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
                            <path d='M7 12h14l-3 -3m0 6l3 -3' />
                          </svg>
                          <span className='ml-2 text-sm'>Sign out</span>
                        </Link>
                      </div>
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
                <div className='mt-8 flex flex-wrap justify-center gap-4 sm:justify-normal md:gap-1 lg:space-x-10'>
                  {menuItems.map((item) => (
                    <div
                      key={item.title}
                      className={`w-40 rounded-xl ${subtype === item.subtype ? 'bg-1stop-accent1' : 'bg-1stop-accent2 hover:opacity-50'} p-8`}
                    >
                      <div
                        onClick={handleScroll}
                        ref={cardRef}
                        className='hidden'
                      >
                        scroll anchor
                      </div>
                      <Link
                        href={item.link}
                        className='text-black-600 flex flex-col items-center'
                      >
                        {typeof item.image === 'string' ? (
                          <img
                            className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                            src={item.image}
                            alt=''
                          />
                        ) : (
                          <div
                            className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                            dangerouslySetInnerHTML={{ __html: item.image.svg }}
                          />
                        )}
                        <span className='subheader-sm-1stop pt-4 text-center'>{item.title}</span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className='small-1stop mt-10'>{findDescription(activeTab)}</div>
              </div>
            )}
            <button
              className='fixed bottom-12 left-4 flex h-8 w-8 items-center justify-center rounded bg-1stop-accent2 hover:opacity-50 hover:shadow-xl'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-custom'
                width={20}
                height={20}
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path
                  stroke='none'
                  d='M0 0h24v24H0z'
                />
                <path d='M4.5 18.75l7.5-7.5 7.5 7.5' />
                <path d='M4.5 12.75l7.5-7.5 7.5 7.5' />
              </svg>
            </button>
          </div>
          <div className='mx-auto mt-4 flex w-11/12 flex-col px-4 py-10 sm:hidden 2xl:w-10/12'>
            <div className='flex flex-col justify-between gap-5 sm:flex-row sm:gap-0'>
              <div className='flex justify-between'>
                <div className='flex-shrink-0'>
                  <Link
                    href='/meta-structure'
                    className='cursor-pointer hover:opacity-50'
                  >
                    <ApplicationLogo className='h-24 w-auto rounded-2xl' />
                  </Link>
                </div>
                <div className='flex'>
                  <div
                    className='flex flex-shrink-0 items-center justify-center sm:relative sm:justify-normal'
                    ref={profileRef}
                  >
                    <div
                      className='h1-stop flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-1stop-highlight text-2xl text-white hover:text-black'
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
                    <div className='flex justify-center'>
                      <div className='bg:opacity-100 z-50 mt-4 w-48 rounded-xl border border-1stop-highlight bg-1stop-white p-2 shadow sm:absolute sm:right-10'>
                        <div className='px-4 py-2'>
                          <p className='small-1stop text-gray-900'>Logged in as {userName}</p>
                        </div>
                        <hr />
                        <div className='py-2'>
                          <Link
                            href='/logout'
                            method='post'
                            className='text-black-700 small-1stop flex w-full rounded px-4 py-2 text-left hover:bg-1stop-gray'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='icon icon-tabler icon-tabler-logout'
                              width={20}
                              height={20}
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='currentColor'
                              fill='none'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <path
                                stroke='none'
                                d='M0 0h24v24H0z'
                              />
                              <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
                              <path d='M7 12h14l-3 -3m0 6l3 -3' />
                            </svg>
                            <span className='ml-2 text-sm'>Sign out</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-center justify-center px-1 md:flex-row md:space-x-12'>
                {headings.map((heading) => (
                  <div
                    key={heading.value}
                    className={`cursor-pointer pb-2 tracking-widest ${activeHeading === heading.value ? 'subheader-1stop 1stop-highlight' : '1stop-gray'}`}
                    onClick={() => setActiveHeading(heading.value)}
                  >
                    <h1
                      className={`subheader-1stop ${activeHeading === heading.value ? 'text-1stop-highlight' : 'text-1stop-gray'}`}
                    >
                      {heading.name}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
            {activeHeading === 'manage' && (
              <div className='mt-10'>
                <Tab
                  tabItems={dashboardMenuItems}
                  activeTab={activeTab}
                  setActiveTab={changeTab}
                />
                <div className='mt-8 flex flex-wrap justify-center gap-4 sm:justify-normal md:gap-1 lg:space-x-10'>
                  {menuItems.map((item) => (
                    <div
                      key={item.title}
                      className={`w-40 rounded-xl ${subtype === item.subtype ? 'bg-1stop-accent1' : 'bg-1stop-accent2 hover:opacity-50'} p-8`}
                    >
                      <div
                        onClick={handleScroll}
                        ref={cardRef}
                        className='hidden'
                      >
                        scroll anchor
                      </div>
                      <Link
                        href={item.link}
                        className='text-black-600 flex flex-col items-center'
                      >
                        {typeof item.image === 'string' ? (
                          <img
                            className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                            src={item.image}
                            alt=''
                          />
                        ) : (
                          <div
                            className='h-10 w-10 justify-center pt-1 md:h-20 md:w-20'
                            dangerouslySetInnerHTML={{ __html: item.image.svg }}
                          />
                        )}
                        <span className='subheader-sm-1stop pt-1 text-center'>{item.title}</span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className='small-1stop mt-10'>{findDescription(activeTab)}</div>
              </div>
            )}
            <button
              className='fixed bottom-12 left-4 flex h-8 w-8 items-center justify-center rounded bg-1stop-highlight hover:opacity-50 hover:shadow-xl'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src='scroll_up.svg'
                alt='GO TO TOP'
                className='h-6 w-6'
              />
            </button>
          </div> */}
          <div>{children}</div>
        </AdminLayoutPadding>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  )
}
