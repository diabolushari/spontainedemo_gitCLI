import { usePage } from '@inertiajs/react'
import { Link } from 'lucide-react'
import { User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
  title?: string
  description?: string
  handleCardRef?: () => void
}
const List = [{ name: 'test 1' }, { name: 'test 2' }]
export default function DashboardLayout({ children }: Properties) {
  const [focused, setFocused] = useState(false)
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
    <div className='flex min-h-screen flex-col'>
      <div className='flex min-h-screen relative'>
        <div
          className='absolute top-0 flex transform flex-col items-center border-r border-gray-200 bg-1stop-white px-5 py-6 transition delay-700 duration-700 ease-in-out hover:min-w-fit'
          onMouseOut={() => setFocused(false)}
          onMouseOver={() => setFocused(true)}
        >
          <div className='cursor-pointer'>
            <img
              src='/one-stop-logo.svg'
              alt='one stop logo'
              className='h-14 w-14'
            />
          </div>
          <div className='mt-44 flex flex-col gap-20'>
            <div className='mr-auto flex items-center gap-3'>
              <img
                src='/sidebar-logo-1.png'
                alt='one stop logo'
                className='h-14 w-14'
              />
              {focused && <span className='uppercase'>Service delivery</span>}
            </div>
            <div className='mr-auto flex items-center gap-3'>
              <img
                src='/sidebar-logo-2.png'
                alt='one stop logo'
                className='h-14 w-14'
              />
              {focused && <span className='uppercase'>operations</span>}
            </div>
            <div className='mr-auto flex items-center gap-3'>
              <div className='rounded-full bg-[#D9DEE8]'>
                <img
                  src='/sidebar-logo-3.svg'
                  alt='one stop logo'
                  className='h-14 w-14 p-3'
                />
              </div>
              {focused && <span className='uppercase'>financial</span>}
            </div>
          </div>
          <div className='mr-auto mt-auto flex items-center gap-3 rounded-full'>
            <div className='rounded-full bg-[#D9DEE8]'>
              <img
                src='/sidebar-setting.svg'
                alt='one stop logo'
                className='h-14 w-14 p-3'
              />
            </div>
            {focused && <span className='uppercase'>admin</span>}
          </div>
        </div>
        <div className='ml-auto mr-10 flex gap-20 pt-10'>
          <div className='flex flex-col'>
            <SelectList
              setData={() => {}}
              list={List}
              dataKey='name'
              displayKey='name'
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

      <div className='flex flex-col'>{children}</div>
    </div>
  )
}
