import { Link, usePage } from '@inertiajs/react'
import { User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { SvgImage } from './dashboard-menu-items'
import { cn } from '@/utils'
import { motion } from 'framer-motion'
import styles from './DashboardLayout.module.css'
import SideBar from './SideBar'

interface Properties {
  children?: ReactNode
  type?: string
}

interface DashboardSidebarList {
  name: string
}

const sidebarList: DashboardSidebarList[] = [{ name: 'test 1' }, { name: 'test 2' }]

export default function DashboardLayout({ children, type = 'Service delivery' }: Properties) {
  const [focused, setFocused] = useState(false)
  const [title, setTitle] = useState('')
  const [isProfileDropdown, setIsProfileDropdown] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const User = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : ''
  const userName = User?.name || ''
  return (
    <div className='absolute flex h-full flex-col border-r sm:relative'>
      <div className='absolute flex h-full border-r sm:relative'>
        <SideBar
          focused={focused}
          type={type}
        />

        <div className='absolute right-0 ml-auto mr-10 flex gap-16 pt-10'>
          <div className='flex min-w-48 flex-col'>
            <SelectList
              setValue={() => setTitle}
              list={sidebarList}
              dataKey='name'
              displayKey='name'
              value={title}
            />
          </div>
          <div className='flex min-w-48 flex-col'>
            <SelectList
              setValue={() => setTitle}
              list={sidebarList}
              dataKey='name'
              displayKey='name'
              value={title}
            />
          </div>
          <div className=''>
            <div
              className='flex flex-shrink-0 items-center justify-center sm:relative sm:justify-normal'
              ref={profileRef}
            >
              <div
                className='h1-stop flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#F4B552] text-2xl text-white hover:text-black'
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
                  <div className='flex px-4 py-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-logout'
                      width={20}
                      height={20}
                      viewBox=''
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
                    <span className='ml-2'>Sign out</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 100 }}
        transition={{ duration: 0.3 }}
        className='fixed inset-0'
      >
        <main className={cn(`ml-24 mt-20 flex flex-col`, `${focused ? 'ml-64' : ''}`)}>
          {children}
        </main>
      </motion.div>
      {/* <div className={cn(`fixed inset-0 ml-24 mt-20 flex flex-col`, `${focused ? 'ml-64' : ''}`)}>
        {children}
      </div> */}
    </div>
  )
}
