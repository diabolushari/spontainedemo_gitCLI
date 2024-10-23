import { Link, usePage } from '@inertiajs/react'
import { Model, User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { cn } from '@/utils'
import { motion } from 'framer-motion'
import styles from './DashboardLayout.module.css'
import SideBar from './SideBar'
import { Mail, MessageSquare, PlusCircle, UserPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import useFetchList from '@/hooks/useFetchList'

interface Properties {
  children?: ReactNode
  type?: string
}

interface OfficeInfo extends Model {
  circle_code?: string
  circle_id?: string
  circle_name?: string
  data_date?: string
  division_code?: string
  division_id?: string
  division_name?: string
  region_code?: string
  region_id?: string
  region_name?: string
  section_code?: string
  section_id?: string
  section_name?: string
  subdivision_code?: string
  subdivision_id?: string
  subdivision_name?: string
}

interface OfficeStructure {
  circle_name: string
  circle_code: string
  divisions: {
    division_code: string
    division_name: string
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
      sections: { section_code: string; section_name: string }[]
    }[]
  }[]
}

const dashboardSidebarItems = [
  {
    name: 'Service delivery',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M16.8039 30.0001C18.0354 30.0001 19.0337 29.0151 19.0337 27.8001C19.0337 26.5851 18.0354 25.6001 16.8039 25.6001C15.5725 25.6001 14.5742 26.5851 14.5742 27.8001C14.5742 29.0151 15.5725 30.0001 16.8039 30.0001Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M19.0344 12.4C20.2659 12.4 21.2641 11.415 21.2641 10.2C21.2641 8.98497 20.2659 8 19.0344 8C17.803 8 16.8047 8.98497 16.8047 10.2C16.8047 11.415 17.803 12.4 19.0344 12.4Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M24.6086 21.1998C25.8401 21.1998 26.8384 20.2148 26.8384 18.9998C26.8384 17.7848 25.8401 16.7998 24.6086 16.7998C23.3772 16.7998 22.3789 17.7848 22.3789 18.9998C22.3789 20.2148 23.3772 21.1998 24.6086 21.1998Z'
            fill='#2CA9BC'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M11.2297 21.1998C12.4612 21.1998 13.4595 20.2148 13.4595 18.9998C13.4595 17.7848 12.4612 16.7998 11.2297 16.7998C9.99828 16.7998 9 17.7848 9 18.9998C9 20.2148 9.99828 21.1998 11.2297 21.1998Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M22.3779 19H13.459'
            stroke='#333333'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.3618 11.8501L12.9023 17.3501'
            stroke='#333333'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M22.9347 20.6499L18.4746 26.1499'
            stroke='#333333'
            strokeWidth='2'
          />
        </svg>
      ),
    },
    link: '/service-delivery',
  },
  {
    name: 'operations',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13.34 12.2929L12.7673 12.1677C12.2572 12.0562 11.6621 11.9237 11.2929 12.2929V12.2929C11.1054 12.4804 11 12.7348 11 13V28.0161C11 28.9558 11.9602 29.5896 12.8243 29.2204V29.2204C13.1536 29.0797 13.5263 29.0799 13.8554 29.2212L14.505 29.5C15.2489 29.8193 16.0911 29.8193 16.835 29.5V29.5C17.5789 29.1807 18.4211 29.1807 19.165 29.5V29.5C19.9089 29.8193 20.7511 29.8193 21.495 29.5L22.1446 29.2212C22.4737 29.0799 22.8464 29.0797 23.1757 29.2204V29.2204C24.0398 29.5896 25 28.9558 25 28.0161V27'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M24 8H15C14.7348 8 14.4804 8.10536 14.2929 8.29289C14.1054 8.48043 14 8.73478 14 9V24.0161C14 24.9558 14.9602 25.5896 15.8243 25.2204V25.2204C16.1536 25.0797 16.5263 25.0799 16.8554 25.2212L17.505 25.5C18.2489 25.8193 19.0911 25.8193 19.835 25.5V25.5C20.5789 25.1807 21.4211 25.1807 22.165 25.5V25.5C22.9089 25.8193 23.7511 25.8193 24.495 25.5L25.1446 25.2212C25.4737 25.0799 25.8464 25.0797 26.1757 25.2204V25.2204C27.0398 25.5896 28 24.9558 28 24.0161V23'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M29.9504 11.6587C29.5952 11.6587 29.3073 11.9466 29.3073 12.3018C29.3073 12.657 29.5952 12.945 29.9504 12.945H30.2214C30.6514 12.945 31 13.2936 31 13.7236C31 14.1535 30.6514 14.5021 30.2214 14.5021H30.0291C29.5545 14.5021 29.1633 14.8509 29.007 15.299C28.7732 15.9694 28.3984 16.4823 27.8827 16.8378C27.3458 17.2138 26.5943 17.4441 25.628 17.5287C25.1345 17.5719 24.7318 17.9672 24.7318 18.4626C24.7318 18.9929 24.838 19.4104 25.0503 19.7151C25.2737 20.0197 25.648 20.1721 26.1732 20.1721C26.676 20.1721 27.0391 20.031 27.2626 19.7489C27.6322 19.2636 28.2433 18.8116 28.7858 19.0906L29.3378 19.3745C29.7431 19.5829 30.0988 20.06 29.8328 20.4301C29.6225 20.7229 29.2386 20.6891 28.8212 21.103C28.2067 21.701 27.3296 22 26.1899 22C25.0056 22 24.1006 21.6784 23.4749 21.0353C22.8492 20.3921 22.5363 19.4556 22.5363 18.2257C22.5363 16.9824 23.5459 16.0007 24.7866 15.9216C24.9328 15.9123 25.0654 15.9018 25.1844 15.89C25.7542 15.8223 26.1788 15.6869 26.4581 15.4838C26.9413 15.1324 26.4546 14.5021 25.8572 14.5021H22.7786C22.3486 14.5021 22 14.1535 22 13.7236C22 13.2936 22.3486 12.945 22.7786 12.945H26.4518C26.807 12.945 27.095 12.657 27.095 12.3018C27.095 11.9466 26.807 11.6587 26.4518 11.6587H22.8293C22.3713 11.6587 22 11.2874 22 10.8293C22 10.3713 22.3713 10 22.8293 10H30.1707C30.6287 10 31 10.3713 31 10.8293C31 11.2874 30.6287 11.6587 30.1707 11.6587H29.9504Z'
            fill='#73ADE1'
          />
          <rect
            x='17'
            y='15'
            width='4'
            height='2'
            rx='1'
            fill='#2CA9BC'
          />
        </svg>
      ),
    },
    link: '/operation',
  },
  {
    name: 'financial',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17.8889 21.3333H26.7778V16.6667H17.8889V21.3333ZM14.5556 21.3333H9V26H14.5556V21.3333ZM14.5556 12H9V16.6667H14.5556V12Z'
            stroke='#73ADE1'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M23.4444 21.3333H14.5556V26H23.4444M23.4444 21.3333V26M23.4444 21.3333H29V26H23.4444M9 21.3333H17.8889V16.6667H9V21.3333ZM14.5556 16.6667H23.4444V12H14.5556V16.6667Z'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
    },
    link: '/finance',
  },
]

const findDivisions = (circleCode: string, officesInCircle: OfficeInfo[]) => {
  const divisions: {
    division_code: string
    division_name: string
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
      sections: { section_code: string; section_name: string }[]
    }[]
  }[] = []
  officesInCircle.forEach((office) => {
    const ifExists = divisions.find((division) => division.division_code === office.division_code)
    if (ifExists == null) {
      divisions.push({
        division_code: office.division_code ?? '',
        division_name: office.division_name ?? '',
        subdivisions: findSubdivisions(office.division_code ?? '', officesInCircle),
      })
    }
  })
  return divisions
}

const findSubdivisions = (divisionCode: string, officesInCircle: OfficeInfo[]) => {
  const subdivisions: {
    subdivision_code: string
    subdivision_name: string
    sections: { section_code: string; section_name: string }[]
  }[] = []

  officesInCircle.forEach((office) => {
    const ifExists = subdivisions.find(
      (subdivision) => subdivision.subdivision_code === office.subdivision_code
    )
    if (ifExists == null) {
      subdivisions.push({
        subdivision_code: office.subdivision_code ?? '',
        subdivision_name: office.subdivision_name ?? '',
        sections: findSections(office.subdivision_code ?? '', officesInCircle),
      })
    }
  })

  return subdivisions
}

const findSections = (subdivisionCode: string, officesInCircle: OfficeInfo[]) => {
  const sections: { section_code: string; section_name: string }[] = []

  officesInCircle.forEach((office) => {
    if (office.subdivision_code === subdivisionCode) {
      sections.push({
        section_code: office.section_code ?? '',
        section_name: office.section_name ?? '',
      })
    }
  })

  return sections
}

export default function DashboardLayout({ children, type = 'Service delivery' }: Properties) {
  const [dropdownValues] = useFetchList<OfficeInfo>('subset-level')

  const officeStructures = useMemo(() => {
    const circles: OfficeStructure[] = []
    dropdownValues.forEach((officeInfo) => {
      const ifExist = circles.find((circle) => circle.circle_code === officeInfo.circle_code)
      if (ifExist == null) {
        const officesInCircle = dropdownValues.filter(
          (office) => officeInfo.circle_code === office.circle_code
        )
        circles.push({
          circle_name: officeInfo.circle_name ?? '',
          circle_code: officeInfo.circle_code ?? '',
          divisions: findDivisions(officeInfo.circle_code ?? '', officesInCircle),
        })
      }
    })
    return circles
  }, [dropdownValues])

  console.log(officeStructures)

  const [isShowSideBar, setIsShowSideBar] = useState(false)

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
    <div className='flex h-full flex-col border-r sm:relative'>
      <div className={`flex h-full border-r sm:relative ${isShowSideBar ? 'z-[999]' : ''}`}>
        <SideBar
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
          type={type}
        />

        <div className='right-0 ml-auto mr-10 flex gap-16 pt-10'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className='text-white'
                aria-label='Customise options'
              >
                SECTION: ALL
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuGroup>
                {officeStructures.map((circle) => {
                  return (
                    <DropdownMenuSub key={circle.circle_code}>
                      <DropdownMenuSubTrigger>{circle.circle_name} </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {circle.divisions.map((division) => {
                            return (
                              <DropdownMenuSub key={division.division_code}>
                                <DropdownMenuSubTrigger>
                                  {division.division_name}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {division.subdivisions.map((subdivision) => {
                                    return (
                                      <DropdownMenuSub key={subdivision.subdivision_code}>
                                        <DropdownMenuSubTrigger>
                                          {subdivision.subdivision_name}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                          {subdivision.sections.map((section) => {
                                            return (
                                              <DropdownMenuSub key={section.section_code}>
                                                <DropdownMenuItem>
                                                  {section.section_name}
                                                </DropdownMenuItem>
                                              </DropdownMenuSub>
                                            )
                                          })}
                                        </DropdownMenuSubContent>
                                      </DropdownMenuSub>
                                    )
                                  })}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            )
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

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
        className=''
      >
        <main className={cn(`ml-24 flex flex-col`, `${isShowSideBar ? '' : 'z-[999]'}`)}>
          {children}
        </main>
      </motion.div>
      {/* <div className={cn(`fixed inset-0 ml-24 mt-20 flex flex-col`, `${focused ? 'ml-64' : ''}`)}>
        {children}
      </div> */}
    </div>
  )
}
